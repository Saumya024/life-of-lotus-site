// Pathway Browsing (Public - No Auth Required)
import supabase from './supabase-client.js';
import { ENABLE_DYNAMIC_PATHWAYS, ENABLE_AUTH } from './feature-flags.js';

// Get all platform pathways (public)
async function getPlatformPathways() {
  const { data, error } = await supabase
    .from('pathways')
    .select(`
      *,
      pathway_requirements (*),
      pathway_blocks (*)
    `)
    .eq('type', 'platform')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return { data, error };
}

// Get single pathway details (public for platform pathways)
async function getPathwayDetails(pathwayId) {
  const { data, error } = await supabase
    .from('pathways')
    .select(`
      *,
      pathway_requirements (*),
      pathway_blocks (*)
    `)
    .eq('pathway_id', pathwayId)
    .single();

  return { data, error };
}

// Handle "Start Pathway" button click
async function handleStartPathway(pathwayId) {
  // Import and use the start pathway handler
  const { handleStartPathway: startHandler } = await import('./start-pathway.js');
  return startHandler(pathwayId);
}


// Get pathway requirements
async function getPathwayRequirements(pathwayId) {
  const { getPathwayRequirements } = await import('./pathway-auth.js');
  return getPathwayRequirements(pathwayId);
}

// Initialize pathway browsing page
async function initPathwayBrowse() {
  if (!ENABLE_DYNAMIC_PATHWAYS) {
    return;
  }
  
  const container = document.getElementById('pathways-container');
  if (!container) return;
  
  // Show loading state
  container.innerHTML = '<div class="loading-state"><p>Loading pathways...</p></div>';
  
  try {
    // Load pathways (no auth required)
    const { data: pathways, error } = await getPlatformPathways();
    
    if (error) {
      console.error('Error loading pathways:', error);
      container.innerHTML = `
        <div class="error-state">
          <p>Error loading pathways. Please try again later.</p>
        </div>
      `;
      return;
    }

    // Render pathways
    renderPathways(pathways || []);
  } catch (error) {
    console.error('Error initializing pathway browse:', error);
    container.innerHTML = `
      <div class="error-state">
        <p>Error loading pathways. Please try again later.</p>
      </div>
    `;
  }
}

// Render pathways list
function renderPathways(pathways) {
  const container = document.getElementById('pathways-container');
  if (!container) return;

  if (!pathways || pathways.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No pathways available at this time.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pathways.map(pathway => {
    const pathwayData = pathway.pathway_data || {};
    const requirements = pathway.pathway_requirements?.[0];
    const blocks = pathway.pathway_blocks || [];
    
    // Calculate total days
    const totalDays = blocks.length > 0 
      ? Math.max(...blocks.map(b => b.day_number || 1))
      : 0;
    
    // Get overview/description
    const overview = pathwayData.overview || pathwayData.description || 
      'A structured pathway for exploration and practice.';
    
    // Get primary pillar/goal
    const primaryPillar = pathwayData.primary_pillar || pathwayData.primary_goal || '';
    
    // Get what this helps with
    const helpsWith = pathwayData.helps_with || pathwayData.secondary_goals || [];
    const helpsWithText = Array.isArray(helpsWith) 
      ? helpsWith.join(', ') 
      : (helpsWith || '');
    
    // Get suitability
    const suitableFor = pathwayData.suitable_for || pathwayData.this_pathway_is_for || [];
    const notSuitableFor = pathwayData.not_suitable_for || pathwayData.this_pathway_is_not_for || [];
    
    // Get time commitment
    const dailyTime = pathwayData.daily_time_commitment || {};
    const minTime = dailyTime.minimum || '';
    const typicalTime = dailyTime.typical || '';
    const intensity = pathwayData.intensity_level || '';
    
    // Get duration
    const duration = pathwayData.total_duration || totalDays ? `${totalDays} days` : '';
    
    return `
      <div class="guided-pathway-card" data-pathway-id="${pathway.pathway_id}">
        <h2 class="pathway-card-title">${pathway.title}</h2>
        
        ${primaryPillar ? `<p class="pathway-primary-pillar">${primaryPillar}</p>` : ''}
        
        <div class="pathway-overview">
          <p>${overview}</p>
        </div>
        
        ${helpsWithText ? `
          <div class="pathway-helps-with">
            <strong>What this helps with:</strong> ${helpsWithText}
          </div>
        ` : ''}
        
        ${duration ? `
          <div class="pathway-meta">
            <span class="pathway-duration">Duration: ${duration}</span>
            ${typicalTime ? `<span class="pathway-time">Daily: ${typicalTime}</span>` : ''}
            ${intensity ? `<span class="pathway-intensity">${intensity}</span>` : ''}
          </div>
        ` : ''}
        
        ${suitableFor.length > 0 ? `
          <div class="pathway-suitability">
            <strong>This pathway is for:</strong>
            <ul>
              ${suitableFor.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${notSuitableFor.length > 0 ? `
          <div class="pathway-suitability-not">
            <strong>This pathway is not for:</strong>
            <ul>
              ${notSuitableFor.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${requirements && (requirements.materials_required || requirements.environment_required) ? `
          <div class="pathway-requirements-preview">
            <strong>Requirements:</strong>
            ${requirements.materials_required ? 'Materials needed' : ''}
            ${requirements.environment_required ? 'Specific environment' : ''}
          </div>
        ` : ''}
        
        <div class="pathway-cta">
          ${ENABLE_AUTH ? 
            `<button class="start-pathway-btn" data-pathway-id="${pathway.pathway_id}">Start Pathway</button>` :
            `<button class="read-journey-btn" data-pathway-id="${pathway.pathway_id}">Read the Journey</button>`
          }
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners
  if (ENABLE_AUTH) {
    container.querySelectorAll('.start-pathway-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const pathwayId = btn.dataset.pathwayId;
        await handleStartPathway(pathwayId);
      });
    });
  } else {
    container.querySelectorAll('.read-journey-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Scroll to pathway content or remain on page
        const pathwayCard = btn.closest('.guided-pathway-card');
        if (pathwayCard) {
          pathwayCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

export {
  getPlatformPathways,
  getPathwayDetails,
  handleStartPathway,
  initPathwayBrowse,
  getPathwayRequirements
};

