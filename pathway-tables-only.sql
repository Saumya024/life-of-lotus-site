-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('user', 'practitioner')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practitioners table
CREATE TABLE public.practitioners (
  practitioner_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  credentials TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pathways table
CREATE TABLE public.pathways (
  pathway_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('platform', 'practitioner')) NOT NULL,
  title TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
  created_by_practitioner_id UUID,
  assigned_user_id UUID,
  version TEXT DEFAULT '1.0.0',
  pathway_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT platform_pathway_check CHECK (
    (type = 'platform' AND created_by_practitioner_id IS NULL AND assigned_user_id IS NULL) OR
    (type = 'practitioner' AND created_by_practitioner_id IS NOT NULL)
  )
);

-- Pathway blocks table
CREATE TABLE public.pathway_blocks (
  block_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pathway_id UUID NOT NULL,
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'flexible')),
  instructions TEXT[] NOT NULL,
  duration_minutes INTEGER,
  materials TEXT[],
  attribution TEXT CHECK (attribution IN ('platform', 'practitioner')) DEFAULT 'platform',
  practice_type TEXT,
  block_order INTEGER NOT NULL,
  day_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pathway requirements table
CREATE TABLE public.pathway_requirements (
  requirement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pathway_id UUID UNIQUE NOT NULL,
  materials_required JSONB,
  environment_required JSONB,
  setup_time_minutes INTEGER,
  acknowledgement_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

