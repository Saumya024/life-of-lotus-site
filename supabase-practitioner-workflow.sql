-- SUPABASE DASHBOARD WORKFLOW: Create Practitioner-Issued Pathway
-- Execute these steps in Supabase SQL Editor

-- STEP 1: Verify practitioner exists
-- Replace 'practitioner_email@example.com' with actual practitioner email
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  p.practitioner_id,
  p.credentials,
  p.country
FROM public.users u
JOIN public.practitioners p ON p.user_id = u.id
WHERE u.email = 'practitioner_email@example.com';

-- STEP 2: Get target user (client) ID
-- Replace 'client_email@example.com' with actual client email
SELECT 
  id as user_id,
  email,
  name
FROM public.users
WHERE email = 'client_email@example.com';

-- STEP 3: Create practitioner-issued pathway
-- Replace placeholders with actual values:
-- - practitioner_id: from STEP 1
-- - assigned_user_id: from STEP 2
-- - pathway_data: JSON structure with attribution and content
INSERT INTO public.pathways (
  type,
  title,
  status,
  created_by_practitioner_id,
  assigned_user_id,
  version,
  pathway_data
) VALUES (
  'practitioner',
  'Your Pathway Title Here',
  'active',
  'PRACTITIONER_ID_FROM_STEP_1',  -- UUID from practitioners table
  'USER_ID_FROM_STEP_2',          -- UUID from users table
  '1.0.0',
  '{
    "primary_pillar": "Example: Career Guidance",
    "secondary_goals": ["Goal 1", "Goal 2"],
    "suitability": {
      "is_for": ["People facing career transitions"],
      "is_not_for": ["People seeking medical advice"]
    },
    "commitment": {
      "total_duration_weeks": 4,
      "daily_time_min": 15,
      "daily_time_typical": 20,
      "intensity_level": "moderate",
      "flexibility_level": "adjustable",
      "expected_consistency": "daily"
    },
    "attribution": {
      "source": "practitioner",
      "practitioner_id": "PRACTITIONER_ID_FROM_STEP_1",
      "practitioner_name": "Practitioner Name",
      "credentials": "Certified Astrologer",
      "jurisdiction": "India",
      "responsibility_statement": "This recommendation is made solely by the practitioner named above. Life of Lotus provides the delivery platform only and assumes no responsibility for practitioner recommendations.",
      "responsibility_confirmed": "true"
    }
  }'::jsonb
) RETURNING pathway_id, title, assigned_user_id;

-- STEP 4: Add pathway requirements
-- Replace PATHWAY_ID with the pathway_id returned from STEP 3
INSERT INTO public.pathway_requirements (
  pathway_id,
  materials_required,
  environment_required,
  setup_time_minutes,
  acknowledgement_required
) VALUES (
  'PATHWAY_ID_FROM_STEP_3',
  '[
    {"item": "Journal or notebook", "required": true, "category": "writing"},
    {"item": "Quiet space", "required": true, "category": "environment"}
  ]'::jsonb,
  '{
    "space_type": ["quiet_room", "private_space"],
    "time_based_needs": ["morning_light"],
    "setup_effort_minutes": 5
  }'::jsonb,
  5,
  true
) RETURNING requirement_id, pathway_id;

-- STEP 5: Add pathway blocks
-- Replace PATHWAY_ID with the pathway_id from STEP 3
-- Add multiple blocks for different days
INSERT INTO public.pathway_blocks (
  pathway_id,
  day_number,
  block_order,
  time_of_day,
  instructions,
  duration_minutes,
  materials,
  attribution,
  practice_type
) VALUES 
-- Day 1, Morning Block
(
  'PATHWAY_ID_FROM_STEP_3',
  1,
  1,
  'morning',
  ARRAY[
    'Find a quiet space',
    'Sit comfortably',
    'Take 5 deep breaths',
    'Reflect on your intention for today'
  ],
  15,
  ARRAY['Journal', 'Pen'],
  'practitioner',
  'awareness'
),
-- Day 1, Evening Block
(
  'PATHWAY_ID_FROM_STEP_3',
  1,
  2,
  'evening',
  ARRAY[
    'Review your day',
    'Write 3 things you noticed',
    'Set intention for tomorrow'
  ],
  10,
  ARRAY['Journal', 'Pen'],
  'practitioner',
  'reflection'
),
-- Day 2, Morning Block
(
  'PATHWAY_ID_FROM_STEP_3',
  2,
  1,
  'morning',
  ARRAY[
    'Repeat Day 1 morning practice',
    'Add: Notice any patterns from yesterday'
  ],
  20,
  ARRAY['Journal', 'Pen'],
  'practitioner',
  'awareness'
)
RETURNING block_id, pathway_id, day_number, time_of_day;

-- STEP 6: Verify pathway is assigned correctly
-- Replace USER_ID with the user_id from STEP 2
SELECT 
  p.pathway_id,
  p.title,
  p.type,
  p.status,
  p.assigned_user_id,
  u.email as assigned_user_email,
  pr.practitioner_id,
  pr.name as practitioner_name
FROM public.pathways p
JOIN public.users u ON u.id = p.assigned_user_id
JOIN public.practitioners pr ON pr.practitioner_id = p.created_by_practitioner_id
WHERE p.assigned_user_id = 'USER_ID_FROM_STEP_2'
  AND p.type = 'practitioner'
  AND p.status = 'active';

-- STEP 7: Verify blocks are linked
-- Replace PATHWAY_ID with pathway_id from STEP 3
SELECT 
  pb.block_id,
  pb.day_number,
  pb.time_of_day,
  pb.instructions,
  pb.duration_minutes,
  pb.attribution
FROM public.pathway_blocks pb
WHERE pb.pathway_id = 'PATHWAY_ID_FROM_STEP_3'
ORDER BY pb.day_number, pb.block_order;

-- STEP 8: Test RLS - Verify user can see their pathway
-- Run this query as the assigned user (use Supabase Auth to get user token)
-- In Supabase Dashboard: Go to Authentication > Users > Select user > Get user token
-- Then use that token in API calls or test in SQL Editor with:
-- SET LOCAL request.jwt.claim.sub = 'USER_ID_FROM_STEP_2';
-- SELECT * FROM public.pathways WHERE pathway_id = 'PATHWAY_ID_FROM_STEP_3';

-- STEP 9: Verify pathway is NOT visible to other users
-- This should return 0 rows when run as a different user
SELECT 
  pathway_id,
  title,
  type
FROM public.pathways
WHERE type = 'practitioner'
  AND assigned_user_id != 'USER_ID_FROM_STEP_2'
  AND pathway_id = 'PATHWAY_ID_FROM_STEP_3';

-- STEP 10: Verify pathway is NOT visible to logged-out users
-- This should return 0 rows when not authenticated
-- Test via API: GET /rest/v1/pathways?pathway_id=eq.PATHWAY_ID
-- Should return empty array for logged-out requests

