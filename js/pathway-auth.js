// Pathway Authentication Gating
import { isAuthenticated, requireAuth, withAuth } from './auth.js';
import supabase from './supabase-client.js';

// Check if user can start pathway (requires auth)
async function canStartPathway(pathwayId) {
  if (!isAuthenticated()) {
    return {
      allowed: false,
      requiresAuth: true,
      error: 'Authentication required to start pathway'
    };
  }

  // Additional checks can be added here (e.g., pathway exists, is active, etc.)
  return {
    allowed: true,
    requiresAuth: false,
    error: null
  };
}

// Start pathway with authentication check
async function startPathway(pathwayId, materialsAcknowledged) {
  return withAuth(async () => {
    const { data: { user } } = await supabase.auth.getSession();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Validate materials acknowledgment
    if (!materialsAcknowledged) {
      throw new Error('Materials and environment requirements must be acknowledged');
    }

    // Check pathway requirements
    const { data: requirements, error: reqError } = await supabase
      .from('pathway_requirements')
      .select('acknowledgement_required')
      .eq('pathway_id', pathwayId)
      .single();

    if (reqError) {
      throw new Error('Pathway requirements not found');
    }

    if (requirements.acknowledgement_required && !materialsAcknowledged) {
      throw new Error('Materials acknowledgment required');
    }

    // Create pathway assignment
    const { data: assignment, error: assignError } = await supabase
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

    if (assignError) {
      throw assignError;
    }

    return { data: assignment, error: null };
  }, `/pathways/${pathwayId}/start`);
}

// Get user's pathways (requires auth)
async function getMyPathways() {
  if (!requireAuth('/my-pathways')) {
    return { data: null, error: { message: 'Authentication required' } };
  }

  const { data: { user } } = await supabase.auth.getSession();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('pathway_assignments')
    .select(`
      *,
      pathways (
        *,
        pathway_requirements (*),
        pathway_blocks (*)
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'active');

  return { data, error };
}

// Get pathway requirements (public for platform pathways)
async function getPathwayRequirements(pathwayId) {
  const { data, error } = await supabase
    .from('pathway_requirements')
    .select('*')
    .eq('pathway_id', pathwayId)
    .single();

  return { data, error };
}

// Check if pathway can be viewed by current user
async function canViewPathway(pathwayId) {
  // Platform pathways can be viewed by anyone
  const { data: pathway, error } = await supabase
    .from('pathways')
    .select('type, status, assigned_user_id')
    .eq('pathway_id', pathwayId)
    .single();

  if (error || !pathway) {
    return { allowed: false, reason: 'Pathway not found' };
  }

  // Draft/archived not visible to users
  if (pathway.status !== 'active') {
    return { allowed: false, reason: 'Pathway not active' };
  }

  // Platform pathways visible to all
  if (pathway.type === 'platform') {
    return { allowed: true, reason: null };
  }

  // Practitioner pathways require auth and assignment
  if (pathway.type === 'practitioner') {
    if (!isAuthenticated()) {
      return { allowed: false, reason: 'Authentication required', requiresAuth: true };
    }

    const { data: { user } } = await supabase.auth.getSession();
    if (pathway.assigned_user_id !== user?.id) {
      return { allowed: false, reason: 'Pathway not assigned to user' };
    }

    return { allowed: true, reason: null };
  }

  return { allowed: false, reason: 'Unknown pathway type' };
}

export {
  canStartPathway,
  startPathway,
  getMyPathways,
  getPathwayRequirements,
  canViewPathway
};




