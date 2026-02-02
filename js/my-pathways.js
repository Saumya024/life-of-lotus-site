// My Pathways Page (Requires Authentication)
import { requireAuth, getCurrentUser } from './auth.js';
import supabase from './supabase-client.js';

// Fetch user's assigned pathways
async function fetchMyPathways() {
  const { data: { user } } = await supabase.auth.getSession();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Fetch pathway assignments with related data
  const { data: assignments, error } = await supabase
    .from('pathway_assignments')
    .select(`
      *,
      pathways (
        pathway_id,
        type,
        title,
        pathway_data,
        created_by_practitioner_id,
        pathway_requirements (
          materials_required,
          environment_required,
          acknowledgement_required
        ),
        pathway_blocks (
          block_id,
          day_number,
          time_of_day,
          instructions,
          duration_minutes,
          materials,
          attribution,
          practice_type,
          block_order
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('started_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Fetch completed days for each assignment
  const assignmentsWithCompletion = await Promise.all((assignments || []).map(async (assignment) => {
    const { data: completedDays } = await supabase
      .from('pathway_completed_days')
      .select('day_number')
      .eq('assignment_id', assignment.assignment_id);
    
    assignment.completed_days = completedDays?.map(cd => cd.day_number) || [];
    return assignment;
  }));

  return assignmentsWithCompletion;
}

// Initialize my-pathways page
async function initMyPathways() {
  // Wait for auth to initialize
  const { initAuth, isAuthenticated } = await import('./auth.js');
  await initAuth();
  
  // Require authentication
  if (!isAuthenticated()) {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
    return; // Redirected to login
  }

  try {
    // Fetch user's pathways
    const assignments = await fetchMyPathways();
    
    if (assignments.length === 0) {
      showEmptyState();
      return;
    }

    // Render pathways
    renderMyPathways(assignments);
  } catch (error) {
    console.error('Error loading pathways:', error);
    showError('Error loading your pathways. Please try again.');
  }
}

// Render user's pathways
function renderMyPathways(assignments) {
  const container = document.getElementById('my-pathways-container');
  if (!container) return;

  container.innerHTML = assignments.map(assignment => {
    const pathway = assignment.pathways;
    if (!pathway) return '';
    
    const isPractitioner = pathway.type === 'practitioner';
    const attribution = pathway.pathway_data?.attribution;
    const materialsAcknowledged = assignment.materials_acknowledged;
    const acknowledgedAt = assignment.materials_acknowledged_at;
    
    // Sort blocks by day_number and block_order
    const sortedBlocks = (pathway.pathway_blocks || []).sort((a, b) => {
      if (a.day_number !== b.day_number) {
        return a.day_number - b.day_number;
      }
      return (a.block_order || 0) - (b.block_order || 0);
    });
    
    // Calculate completion
    const completedDays = assignment.completed_days || [];
    const totalDays = sortedBlocks.length > 0 
      ? Math.max(...sortedBlocks.map(b => b.day_number || 1))
      : 0;
    const completedCount = completedDays.length;
    const completionPercent = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
    
    return `
      <div class="pathway-item" data-pathway-id="${pathway.pathway_id}" data-assignment-id="${assignment.assignment_id}">
        ${isPractitioner && attribution ? renderAttributionBanner(attribution) : ''}
        <h2 class="pathway-title">${pathway.title}</h2>
        <div class="pathway-meta">
          <p class="pathway-status">Status: ${assignment.status}</p>
          <p class="pathway-started">Started: ${formatDate(assignment.started_at)}</p>
        </div>
        ${renderCompletionProgress(completionPercent, completedCount, totalDays)}
        ${renderMaterialsAcknowledgment(materialsAcknowledged, acknowledgedAt, pathway.pathway_requirements)}
        <div class="pathway-blocks-container">
          <h3>Daily Structure</h3>
          ${renderPathwayBlocks(sortedBlocks, completedDays, assignment.assignment_id)}
        </div>
      </div>
    `;
  }).join('');
}

// Render attribution banner for practitioner pathways
function renderAttributionBanner(attribution) {
  if (!attribution) return '';
  
  const practitionerName = attribution.practitioner_name || 'Practitioner';
  const credentials = attribution.credentials || '';
  const jurisdiction = attribution.jurisdiction || '';
  const responsibilityStatement = attribution.responsibility_statement || 
    'This recommendation is made solely by the practitioner named above. I Read Space provides the delivery platform only and assumes no responsibility for practitioner recommendations.';
  
  return `
    <div class="attribution-banner">
      <div class="attribution-header">
        <strong>Practitioner Recommendation</strong>
      </div>
      <div class="attribution-content">
        <p class="attribution-practitioner">
          Recommended by <strong>${practitionerName}</strong>
          ${credentials ? `, ${credentials}` : ''}
          ${jurisdiction ? `, practicing in ${jurisdiction}` : ''}
        </p>
        <p class="attribution-responsibility">
          ${responsibilityStatement}
        </p>
      </div>
    </div>
  `;
}

// Render materials acknowledgment status
function renderMaterialsAcknowledgment(acknowledged, acknowledgedAt, requirements) {
  if (!requirements || !requirements.acknowledgement_required) {
    return '';
  }
  
  const statusClass = acknowledged ? 'acknowledged' : 'not-acknowledged';
  const statusText = acknowledged ? 'Acknowledged' : 'Not Acknowledged';
  const dateText = acknowledged && acknowledgedAt 
    ? ` on ${formatDate(acknowledgedAt)}` 
    : '';
  
  return `
    <div class="materials-acknowledgment ${statusClass}">
      <p><strong>Materials & Environment Requirements:</strong> ${statusText}${dateText}</p>
      ${requirements.materials_required ? `
        <div class="materials-list">
          <strong>Required Materials:</strong>
          <ul>
            ${renderMaterialsList(requirements.materials_required)}
          </ul>
        </div>
      ` : ''}
      ${requirements.environment_required ? `
        <div class="environment-requirements">
          <strong>Environment Requirements:</strong>
          <p>${formatEnvironmentRequirements(requirements.environment_required)}</p>
        </div>
      ` : ''}
    </div>
  `;
}

// Render materials list
function renderMaterialsList(materials) {
  if (!materials || !Array.isArray(materials)) return '';
  
  return materials.map(material => {
    if (typeof material === 'string') {
      return `<li>${material}</li>`;
    }
    if (material.item) {
      const required = material.required ? ' (Required)' : ' (Optional)';
      return `<li>${material.item}${required}</li>`;
    }
    return '';
  }).join('');
}

// Format environment requirements
function formatEnvironmentRequirements(environment) {
  if (typeof environment === 'string') {
    return environment;
  }
  
  if (typeof environment === 'object') {
    const parts = [];
    if (environment.space_type) {
      parts.push(`Space: ${Array.isArray(environment.space_type) ? environment.space_type.join(', ') : environment.space_type}`);
    }
    if (environment.time_based_needs) {
      parts.push(`Time: ${Array.isArray(environment.time_based_needs) ? environment.time_based_needs.join(', ') : environment.time_based_needs}`);
    }
    if (environment.setup_effort_minutes) {
      parts.push(`Setup: ${environment.setup_effort_minutes} minutes`);
    }
    return parts.join(' | ');
  }
  
  return JSON.stringify(environment);
}

// Render completion progress
function renderCompletionProgress(percent, completed, total) {
  return `
    <div class="pathway-completion">
      <div class="completion-header">
        <span class="completion-text">${percent}% complete</span>
        <span class="completion-count">${completed} of ${total} days</span>
      </div>
      <div class="completion-bar">
        <div class="completion-bar-fill" style="width: ${percent}%"></div>
      </div>
    </div>
  `;
}

// Render pathway blocks
function renderPathwayBlocks(blocks, completedDays, assignmentId) {
  if (!blocks || blocks.length === 0) {
    return '<p class="no-blocks">No blocks available for this pathway.</p>';
  }
  
  // Group blocks by day
  const blocksByDay = {};
  blocks.forEach(block => {
    const day = block.day_number || 1;
    if (!blocksByDay[day]) {
      blocksByDay[day] = [];
    }
    blocksByDay[day].push(block);
  });
  
  // Render by day
  return Object.keys(blocksByDay).sort((a, b) => parseInt(a) - parseInt(b)).map(day => {
    const dayBlocks = blocksByDay[day];
    const dayNum = parseInt(day);
    const isCompleted = completedDays.includes(dayNum);
    
    return `
      <div class="pathway-day" data-day="${day}" data-assignment-id="${assignmentId}">
        <div class="day-header-row">
          <h4 class="day-header">Day ${day}</h4>
          <label class="day-complete-checkbox">
            <input type="checkbox" class="day-complete-input" data-day="${day}" ${isCompleted ? 'checked' : ''}>
            <span>Mark as complete</span>
          </label>
        </div>
        ${dayBlocks.map(block => renderBlock(block)).join('')}
      </div>
    `;
  }).join('');
}

// Render individual block
function renderBlock(block) {
  const timeOfDay = block.time_of_day ? ` - ${block.time_of_day}` : '';
  const duration = block.duration_minutes ? ` (${block.duration_minutes} min)` : '';
  const practiceType = block.practice_type ? ` [${block.practice_type}]` : '';
  const attribution = block.attribution === 'practitioner' ? ' (Practitioner-prescribed)' : '';
  
  return `
    <div class="pathway-block" data-block-id="${block.block_id}">
      <div class="block-header">
        <span class="block-time">${block.time_of_day || 'Flexible'}${duration}${practiceType}${attribution}</span>
      </div>
      <div class="block-content">
        ${block.instructions && block.instructions.length > 0 ? `
          <ol class="block-instructions">
            ${block.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
          </ol>
        ` : ''}
        ${block.materials && block.materials.length > 0 ? `
          <div class="block-materials">
            <strong>Materials:</strong> ${block.materials.join(', ')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Show empty state
function showEmptyState() {
  const container = document.getElementById('my-pathways-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="empty-state">
      <p>You don't have any active pathways yet.</p>
      <a href="pathways.html" class="browse-link">Browse Pathways</a>
    </div>
  `;
}

// Show error message
function showError(message) {
  const container = document.getElementById('my-pathways-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="error-state">
      <p>${message}</p>
      <a href="pathways.html" class="browse-link">Browse Pathways</a>
    </div>
  `;
}

// Mark day as complete
async function markDayComplete(assignmentId, dayNumber, isComplete) {
  const { data: { user } } = await supabase.auth.getSession();
  if (!user) return;

  if (isComplete) {
    // Insert completed day
    const { error } = await supabase
      .from('pathway_completed_days')
      .upsert({
        assignment_id: assignmentId,
        day_number: dayNumber,
        user_id: user.id,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'assignment_id,day_number'
      });

    if (error) {
      console.error('Error marking day complete:', error);
      throw error;
    }
  } else {
    // Remove completed day
    const { error } = await supabase
      .from('pathway_completed_days')
      .delete()
      .eq('assignment_id', assignmentId)
      .eq('day_number', dayNumber);

    if (error) {
      console.error('Error unmarking day:', error);
      throw error;
    }
  }
}

// Initialize day completion handlers
function initDayCompletionHandlers() {
  document.addEventListener('change', async (e) => {
    if (e.target.classList.contains('day-complete-input')) {
      const checkbox = e.target;
      const dayNumber = parseInt(checkbox.dataset.day);
      const dayContainer = checkbox.closest('.pathway-day');
      const assignmentId = dayContainer.dataset.assignmentId;
      const isComplete = checkbox.checked;

      try {
        await markDayComplete(assignmentId, dayNumber, isComplete);
        // Reload pathways to update completion
        const assignments = await fetchMyPathways();
        renderMyPathways(assignments);
      } catch (error) {
        // Revert checkbox on error
        checkbox.checked = !isComplete;
        alert('Error updating completion. Please try again.');
      }
    }
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMyPathways();
    initDayCompletionHandlers();
  });
} else {
  initMyPathways();
  initDayCompletionHandlers();
}

export { initMyPathways, fetchMyPathways, markDayComplete };

