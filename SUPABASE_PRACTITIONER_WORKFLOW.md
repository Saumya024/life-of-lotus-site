# Supabase Dashboard Workflow: Create Practitioner-Issued Pathway

## Prerequisites

1. Practitioner account exists in `public.users` and `public.practitioners`
2. Client (user) account exists in `public.users`
3. You have access to Supabase Dashboard SQL Editor

## Step-by-Step Process

### Step 1: Get Practitioner ID

**In Supabase SQL Editor, run:**

```sql
SELECT 
  u.id as user_id,
  u.email,
  p.practitioner_id,
  p.name,
  p.credentials
FROM public.users u
JOIN public.practitioners p ON p.user_id = u.id
WHERE u.email = 'practitioner@example.com';
```

**Note the `practitioner_id` UUID** - you'll need this.

### Step 2: Get Client User ID

**In Supabase SQL Editor, run:**

```sql
SELECT 
  id as user_id,
  email,
  name
FROM public.users
WHERE email = 'client@example.com';
```

**Note the `user_id` UUID** - you'll need this.

### Step 3: Create Pathway

**In Supabase SQL Editor, run:**

```sql
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
  'Your Pathway Title',
  'active',
  'PRACTITIONER_ID_HERE',  -- From Step 1
  'USER_ID_HERE',          -- From Step 2
  '1.0.0',
  '{
    "primary_pillar": "Career Guidance",
    "attribution": {
      "source": "practitioner",
      "practitioner_id": "PRACTITIONER_ID_HERE",
      "practitioner_name": "Practitioner Name",
      "credentials": "Certified Astrologer",
      "jurisdiction": "India",
      "responsibility_statement": "This recommendation is made solely by the practitioner named above.",
      "responsibility_confirmed": "true"
    }
  }'::jsonb
) RETURNING pathway_id;
```

**Note the returned `pathway_id` UUID** - you'll need this for next steps.

### Step 4: Add Requirements

**In Supabase SQL Editor, run:**

```sql
INSERT INTO public.pathway_requirements (
  pathway_id,
  materials_required,
  environment_required,
  setup_time_minutes,
  acknowledgement_required
) VALUES (
  'PATHWAY_ID_HERE',  -- From Step 3
  '[{"item": "Journal", "required": true}]'::jsonb,
  '{"space_type": ["quiet_room"]}'::jsonb,
  5,
  true
);
```

### Step 5: Add Blocks

**In Supabase SQL Editor, run:**

```sql
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
) VALUES (
  'PATHWAY_ID_HERE',  -- From Step 3
  1,
  1,
  'morning',
  ARRAY['Instruction 1', 'Instruction 2'],
  15,
  ARRAY['Journal', 'Pen'],
  'practitioner',
  'awareness'
);
```

### Step 6: Verify Assignment

**In Supabase SQL Editor, run:**

```sql
SELECT 
  p.pathway_id,
  p.title,
  p.assigned_user_id,
  u.email as assigned_to_email
FROM public.pathways p
JOIN public.users u ON u.id = p.assigned_user_id
WHERE p.pathway_id = 'PATHWAY_ID_HERE';
```

Should show the pathway assigned to the correct user.

### Step 7: Test User Visibility

**Option A: Via Supabase API (as the assigned user)**

1. Get user's auth token from Supabase Dashboard > Authentication > Users
2. Make API request:
   ```
   GET https://YOUR_PROJECT.supabase.co/rest/v1/pathway_assignments?select=*,pathways(*,pathway_requirements(*),pathway_blocks(*))
   Headers:
     Authorization: Bearer USER_AUTH_TOKEN
     apikey: YOUR_ANON_KEY
   ```
3. Should return the pathway in results

**Option B: Via SQL with RLS simulation**

```sql
-- Set the user context (simulate logged-in user)
SET LOCAL request.jwt.claim.sub = 'USER_ID_HERE';

-- Try to select pathway
SELECT * FROM public.pathways 
WHERE pathway_id = 'PATHWAY_ID_HERE';
```

Should return 1 row (the pathway).

### Step 8: Verify Privacy (Other Users Cannot See)

**In Supabase SQL Editor, run:**

```sql
-- This should return 0 rows when run as a different user
-- or when not authenticated
SELECT * FROM public.pathways
WHERE type = 'practitioner'
  AND pathway_id = 'PATHWAY_ID_HERE'
  AND assigned_user_id != 'USER_ID_HERE';
```

Should return empty (RLS blocks it).

### Step 9: Verify Logged-Out Users Cannot See

**Test via API without authentication:**

```
GET https://YOUR_PROJECT.supabase.co/rest/v1/pathways?pathway_id=eq.PATHWAY_ID
Headers:
  apikey: YOUR_ANON_KEY
  (no Authorization header)
```

Should return empty array (RLS blocks practitioner pathways for non-authenticated users).

## Verification Checklist

- [ ] Pathway created with `type = 'practitioner'`
- [ ] Pathway has `created_by_practitioner_id` set
- [ ] Pathway has `assigned_user_id` set to target user
- [ ] Pathway `status = 'active'`
- [ ] Pathway has requirements record
- [ ] Pathway has at least one block
- [ ] Attribution data includes `responsibility_confirmed: "true"`
- [ ] Assigned user can see pathway when authenticated
- [ ] Other users cannot see pathway
- [ ] Logged-out users cannot see pathway

## Common Issues

**Issue: User cannot see pathway**
- Check `assigned_user_id` matches user's actual ID
- Verify pathway `status = 'active'`
- Ensure user is authenticated with correct account
- Check RLS policies are enabled

**Issue: Pathway visible to everyone**
- Verify `type = 'practitioner'` (not 'platform')
- Check `assigned_user_id` is set (not NULL)
- Verify RLS policies are active on pathways table

**Issue: Missing attribution**
- Ensure `pathway_data->'attribution'` exists
- Verify `responsibility_confirmed = "true"` in attribution
- Check practitioner_id in attribution matches `created_by_practitioner_id`




