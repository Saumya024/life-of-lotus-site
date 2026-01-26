// Start Pathway Logic
import { isAuthenticated, requireAuth } from './auth.js';
import supabase from './supabase-client.js';

// Fetch pathway requirements
async function fetchPathwayRequirements(pathwayId) {
  const { data, error } = await supabase
    .from('pathway_requirements')
    .select('*')
    .eq('pathway_id', pathwayId)
    .single();

  if (error) {
    throw new Error('Failed to load pathway requirements');
  }

  return data;
}

// Validate pathway can be started
async function validatePathwayStart(pathwayId) {
  // Check pathway exists and is active
  const { data: pathway, error: pathwayError } = await supabase
    .from('pathways')
    .select('pathway_id, type, status, assigned_user_id')
    .eq('pathway_id', pathwayId)
    .single();

  if (pathwayError || !pathway) {
    throw new Error('Pathway not found');
  }

  if (pathway.status !== 'active') {
    throw new Error('Pathway is not active');
  }

  // For practitioner pathways, check assignment
  if (pathway.type === 'practitioner') {
    const { data: { user } } = await supabase.auth.getSession();
    if (!user) {
      throw new Error('Authentication required for practitioner pathways');
    }
    if (pathway.assigned_user_id !== user.id) {
      throw new Error('Pathway not assigned to you');
    }
  }

  return pathway;
}

// Check if user already has active assignment
async function checkExistingAssignment(pathwayId) {
  const { data: { user } } = await supabase.auth.getSession();
  if (!user) return null;

  const { data, error } = await supabase
    .from('pathway_assignments')
    .select('assignment_id, status')
    .eq('pathway_id', pathwayId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('Error checking assignment:', error);
    return null;
  }

  return data;
}

// Show materials acknowledgment modal
function showMaterialsModal(requirements) {
  return new Promise((resolve) => {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'materials-modal-overlay';

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'materials-modal';
    modal.id = 'materials-modal';

    // Build materials list HTML
    const materialsList = renderMaterialsList(requirements.materials_required);
    const environmentInfo = renderEnvironmentInfo(requirements.environment_required);
    const setupTime = requirements.setup_time_minutes 
      ? `<p><strong>Setup Time:</strong> ${requirements.setup_time_minutes} minutes</p>`
      : '';

    modal.innerHTML = `
      <div class="modal-header">
        <h3>Materials & Environment Requirements</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-content">
        <p>Before starting this pathway, please ensure you have access to the following:</p>
        ${materialsList}
        ${environmentInfo}
        ${setupTime}
        <div class="acknowledgment-section">
          <label class="acknowledgment-checkbox">
            <input type="checkbox" id="materials-acknowledged" required>
            <span>I confirm that I have reviewed the materials and environment requirements and have access to them.</span>
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" id="modal-cancel-btn">Cancel</button>
        <button class="btn-confirm" id="modal-confirm-btn" disabled>Start Pathway</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Handle checkbox change
    const checkbox = modal.querySelector('#materials-acknowledged');
    const confirmBtn = modal.querySelector('#modal-confirm-btn');

    checkbox.addEventListener('change', (e) => {
      confirmBtn.disabled = !e.target.checked;
    });

    // Handle close button
    const closeBtn = modal.querySelector('#modal-close-btn');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(false);
    });

    // Handle cancel button
    const cancelBtn = modal.querySelector('#modal-cancel-btn');
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(false);
    });

    // Handle confirm button
    confirmBtn.addEventListener('click', () => {
      if (checkbox.checked) {
        document.body.removeChild(overlay);
        resolve(true);
      }
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        resolve(false);
      }
    });

    // Prevent modal content clicks from closing
    modal.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
}

// Render materials list
function renderMaterialsList(materials) {
  if (!materials) return '';

  if (Array.isArray(materials)) {
    if (materials.length === 0) return '';
    
    const items = materials.map(material => {
      if (typeof material === 'string') {
        return `<li>${material}</li>`;
      }
      if (material.item) {
        const required = material.required !== false ? ' (Required)' : ' (Optional)';
        return `<li>${material.item}${required}</li>`;
      }
      return '';
    }).filter(item => item).join('');

    return items ? `
      <div class="materials-section">
        <h4>Required Materials:</h4>
        <ul>${items}</ul>
      </div>
    ` : '';
  }

  return '';
}

// Render environment information
function renderEnvironmentInfo(environment) {
  if (!environment) return '';

  if (typeof environment === 'string') {
    return `
      <div class="environment-section">
        <h4>Environment Requirements:</h4>
        <p>${environment}</p>
      </div>
    `;
  }

  if (typeof environment === 'object') {
    const parts = [];
    
    if (environment.space_type) {
      const spaceTypes = Array.isArray(environment.space_type) 
        ? environment.space_type.join(', ')
        : environment.space_type;
      parts.push(`<p><strong>Space:</strong> ${spaceTypes}</p>`);
    }
    
    if (environment.time_based_needs) {
      const timeNeeds = Array.isArray(environment.time_based_needs)
        ? environment.time_based_needs.join(', ')
        : environment.time_based_needs;
      parts.push(`<p><strong>Time Requirements:</strong> ${timeNeeds}</p>`);
    }
    
    if (environment.mobility_constraints) {
      parts.push(`<p><strong>Mobility:</strong> ${environment.mobility_constraints}</p>`);
    }

    return parts.length > 0 ? `
      <div class="environment-section">
        <h4>Environment Requirements:</h4>
        ${parts.join('')}
      </div>
    ` : '';
  }

  return '';
}

// Activate pathway (create assignment)
async function activatePathway(pathwayId, materialsAcknowledged) {
  const { data: { user } } = await supabase.auth.getSession();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Validate materials acknowledgment
  if (!materialsAcknowledged) {
    throw new Error('Materials acknowledgment required');
  }

  // Check requirements
  const requirements = await fetchPathwayRequirements(pathwayId);
  
  if (requirements.acknowledgement_required && !materialsAcknowledged) {
    throw new Error('Materials and environment acknowledgment is required');
  }

  // Create pathway assignment
  const { data: assignment, error } = await supabase
    .from('pathway_assignments')
    .insert({
      pathway_id: pathwayId,
      user_id: user.id,
      materials_acknowledged: true,
      materials_acknowledged_at: new Date().toISOString(),
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return assignment;
}

// Main start pathway handler
async function handleStartPathway(pathwayId) {
  try {
    // Check if user is logged in
    if (!isAuthenticated()) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login.html?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    // Validate pathway can be started
    await validatePathwayStart(pathwayId);

    // Check for existing assignment
    const existingAssignment = await checkExistingAssignment(pathwayId);
    if (existingAssignment) {
      // User already has this pathway active
      if (confirm('You already have this pathway active. Would you like to view it?')) {
        window.location.href = '/my-pathways.html';
      }
      return;
    }

    // Fetch requirements
    const requirements = await fetchPathwayRequirements(pathwayId);

    // Show materials acknowledgment modal
    const acknowledged = await showMaterialsModal(requirements);

    if (!acknowledged) {
      // User cancelled
      return;
    }

    // Activate pathway
    const assignment = await activatePathway(pathwayId, true);

    // Redirect to my-pathways
    window.location.href = '/my-pathways.html';
  } catch (error) {
    console.error('Error starting pathway:', error);
    alert('Error starting pathway: ' + error.message);
  }
}

// Initialize start pathway buttons on page
function initStartPathwayButtons() {
  // Find all start pathway buttons
  const startButtons = document.querySelectorAll('[data-start-pathway], .start-pathway-btn');

  startButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const pathwayId = button.dataset.pathwayId || button.dataset.startPathway;
      
      if (!pathwayId) {
        console.error('Pathway ID not found on button');
        return;
      }

      await handleStartPathway(pathwayId);
    });
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStartPathwayButtons);
} else {
  initStartPathwayButtons();
}

export {
  handleStartPathway,
  initStartPathwayButtons,
  fetchPathwayRequirements,
  validatePathwayStart,
  activatePathway
};

