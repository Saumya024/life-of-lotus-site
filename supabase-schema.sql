-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('user', 'practitioner')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practitioners table
CREATE TABLE public.practitioners (
  practitioner_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
  created_by_practitioner_id UUID REFERENCES public.practitioners(practitioner_id) ON DELETE SET NULL,
  assigned_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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
  pathway_id UUID NOT NULL REFERENCES public.pathways(pathway_id) ON DELETE CASCADE,
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
  pathway_id UUID UNIQUE NOT NULL REFERENCES public.pathways(pathway_id) ON DELETE CASCADE,
  materials_required JSONB,
  environment_required JSONB,
  setup_time_minutes INTEGER,
  acknowledgement_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pathways_type_status ON public.pathways(type, status);
CREATE INDEX idx_pathways_assigned_user ON public.pathways(assigned_user_id) WHERE assigned_user_id IS NOT NULL;
CREATE INDEX idx_pathways_created_by ON public.pathways(created_by_practitioner_id) WHERE created_by_practitioner_id IS NOT NULL;
CREATE INDEX idx_pathway_blocks_pathway ON public.pathway_blocks(pathway_id);
CREATE INDEX idx_pathway_requirements_pathway ON public.pathway_requirements(pathway_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practitioners_updated_at BEFORE UPDATE ON public.practitioners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pathways_updated_at BEFORE UPDATE ON public.pathways
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathway_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathway_requirements ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Practitioners table policies
CREATE POLICY "Practitioners can view own record"
  ON public.practitioners FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Practitioners can update own record"
  ON public.practitioners FOR UPDATE
  USING (user_id = auth.uid());

-- Pathways table policies
CREATE POLICY "Anyone can view active platform pathways"
  ON public.pathways FOR SELECT
  USING (
    type = 'platform' 
    AND status = 'active'
  );

CREATE POLICY "Users can view assigned practitioner pathways"
  ON public.pathways FOR SELECT
  USING (
    type = 'practitioner' 
    AND assigned_user_id = auth.uid()
    AND status = 'active'
  );

CREATE POLICY "Practitioners can view own pathways"
  ON public.pathways FOR SELECT
  USING (
    created_by_practitioner_id IN (
      SELECT practitioner_id FROM public.practitioners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Practitioners can create pathways"
  ON public.pathways FOR INSERT
  WITH CHECK (
    created_by_practitioner_id IN (
      SELECT practitioner_id FROM public.practitioners WHERE user_id = auth.uid()
    )
    OR type = 'platform'
  );

CREATE POLICY "Practitioners can update own pathways"
  ON public.pathways FOR UPDATE
  USING (
    created_by_practitioner_id IN (
      SELECT practitioner_id FROM public.practitioners WHERE user_id = auth.uid()
    )
    AND status != 'archived'
  );

-- Pathway blocks policies
CREATE POLICY "Anyone can view blocks for active platform pathways"
  ON public.pathway_blocks FOR SELECT
  USING (
    pathway_id IN (
      SELECT pathway_id FROM public.pathways 
      WHERE type = 'platform' AND status = 'active'
    )
  );

CREATE POLICY "Users can view blocks for assigned practitioner pathways"
  ON public.pathway_blocks FOR SELECT
  USING (
    pathway_id IN (
      SELECT pathway_id FROM public.pathways 
      WHERE type = 'practitioner' 
      AND assigned_user_id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Practitioners can manage blocks for own pathways"
  ON public.pathway_blocks FOR ALL
  USING (
    pathway_id IN (
      SELECT pathway_id FROM public.pathways 
      WHERE created_by_practitioner_id IN (
        SELECT practitioner_id FROM public.practitioners WHERE user_id = auth.uid()
      )
    )
  );

-- Pathway requirements policies
CREATE POLICY "Anyone can view requirements for active platform pathways"
  ON public.pathway_requirements FOR SELECT
  USING (
    pathway_id IN (
      SELECT pathway_id FROM public.pathways 
      WHERE type = 'platform' AND status = 'active'
    )
  );

CREATE POLICY "Users can view requirements for assigned practitioner pathways"
  ON public.pathway_requirements FOR SELECT
  USING (
    pathway_id IN (
      SELECT pathway_id FROM public.pathways 
      WHERE type = 'practitioner' 
      AND assigned_user_id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Practitioners can manage requirements for own pathways"
  ON public.pathway_requirements FOR ALL
  USING (
    pathway_id IN (
      SELECT pathway_id FROM public.pathways 
      WHERE created_by_practitioner_id IN (
        SELECT practitioner_id FROM public.practitioners WHERE user_id = auth.uid()
      )
    )
  );

-- Validation function: Materials acknowledgement required
CREATE OR REPLACE FUNCTION validate_pathway_activation(
  p_pathway_id UUID,
  p_user_id UUID,
  p_materials_acknowledged BOOLEAN
)
RETURNS BOOLEAN AS $$
DECLARE
  v_acknowledgement_required BOOLEAN;
  v_pathway_status TEXT;
  v_pathway_type TEXT;
BEGIN
  SELECT status, type INTO v_pathway_status, v_pathway_type
  FROM public.pathways
  WHERE pathway_id = p_pathway_id;
  
  IF v_pathway_status != 'active' THEN
    RAISE EXCEPTION 'Pathway is not active';
  END IF;
  
  SELECT acknowledgement_required INTO v_acknowledgement_required
  FROM public.pathway_requirements
  WHERE pathway_id = p_pathway_id;
  
  IF v_acknowledgement_required AND NOT p_materials_acknowledged THEN
    RAISE EXCEPTION 'Materials and environment requirements must be acknowledged';
  END IF;
  
  IF v_pathway_type = 'practitioner' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.pathways
      WHERE pathway_id = p_pathway_id
      AND assigned_user_id = p_user_id
    ) THEN
      RAISE EXCEPTION 'Pathway not assigned to user';
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validation function: Practitioner pathway attribution
CREATE OR REPLACE FUNCTION validate_practitioner_pathway(
  p_pathway_data JSONB,
  p_practitioner_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_attribution JSONB;
  v_blocks JSONB;
  v_block JSONB;
BEGIN
  v_attribution := p_pathway_data->'attribution';
  
  IF v_attribution IS NULL THEN
    RAISE EXCEPTION 'Practitioner pathways require attribution';
  END IF;
  
  IF v_attribution->>'practitioner_id' IS NULL THEN
    RAISE EXCEPTION 'Practitioner ID required in attribution';
  END IF;
  
  IF v_attribution->>'practitioner_id' != p_practitioner_id::TEXT THEN
    RAISE EXCEPTION 'Attribution practitioner ID must match creator';
  END IF;
  
  IF v_attribution->>'responsibility_confirmed' != 'true' THEN
    RAISE EXCEPTION 'Responsibility must be confirmed';
  END IF;
  
  v_blocks := p_pathway_data->'daily_structure'->'blocks';
  
  IF v_blocks IS NOT NULL THEN
    FOR v_block IN SELECT * FROM jsonb_array_elements(v_blocks)
    LOOP
      IF (v_block->>'is_practitioner_prescribed')::BOOLEAN THEN
        IF v_block->>'prescriber_id' IS NULL THEN
          RAISE EXCEPTION 'Practitioner-prescribed blocks require prescriber_id';
        END IF;
        IF v_block->>'responsibility_confirmed' != 'true' THEN
          RAISE EXCEPTION 'Practitioner-prescribed blocks require responsibility confirmation';
        END IF;
      END IF;
    END LOOP;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;






