-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Pathway assignments table
CREATE TABLE public.pathway_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pathway_id UUID NOT NULL REFERENCES public.pathways(pathway_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  materials_acknowledged BOOLEAN DEFAULT false,
  materials_acknowledged_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pathway_id, user_id, status)
);

-- Pathway completed days table
CREATE TABLE public.pathway_completed_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES public.pathway_assignments(assignment_id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, day_number)
);

-- Indexes
CREATE INDEX idx_pathways_type_status ON public.pathways(type, status);
CREATE INDEX idx_pathways_assigned_user ON public.pathways(assigned_user_id) WHERE assigned_user_id IS NOT NULL;
CREATE INDEX idx_pathways_created_by ON public.pathways(created_by_practitioner_id) WHERE created_by_practitioner_id IS NOT NULL;
CREATE INDEX idx_pathway_blocks_pathway ON public.pathway_blocks(pathway_id);
CREATE INDEX idx_pathway_requirements_pathway ON public.pathway_requirements(pathway_id);
CREATE INDEX idx_pathway_assignments_user ON public.pathway_assignments(user_id);
CREATE INDEX idx_pathway_assignments_pathway ON public.pathway_assignments(pathway_id);
CREATE INDEX idx_pathway_assignments_status ON public.pathway_assignments(status);
CREATE INDEX idx_pathway_completed_days_assignment ON public.pathway_completed_days(assignment_id);
CREATE INDEX idx_pathway_completed_days_user ON public.pathway_completed_days(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for pathways updated_at
CREATE TRIGGER update_pathways_updated_at BEFORE UPDATE ON public.pathways
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all pathway tables
ALTER TABLE public.pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathway_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathway_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathway_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathway_completed_days ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view blocks for their active assignments"
  ON public.pathway_blocks FOR SELECT
  USING (
    pathway_id IN (
      SELECT pathway_id FROM public.pathway_assignments 
      WHERE user_id = auth.uid() AND status = 'active'
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

CREATE POLICY "Users can view requirements for their active assignments"
  ON public.pathway_requirements FOR SELECT
  USING (
    pathway_id IN (
      SELECT pathway_id FROM public.pathway_assignments 
      WHERE user_id = auth.uid() AND status = 'active'
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

-- Pathway assignments policies
CREATE POLICY "Users can view own assignments"
  ON public.pathway_assignments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own assignments"
  ON public.pathway_assignments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assignments"
  ON public.pathway_assignments FOR UPDATE
  USING (user_id = auth.uid());

-- Pathway completed days policies
CREATE POLICY "Users can view own completed days"
  ON public.pathway_completed_days FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own completed days"
  ON public.pathway_completed_days FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND assignment_id IN (
      SELECT assignment_id FROM public.pathway_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own completed days"
  ON public.pathway_completed_days FOR DELETE
  USING (user_id = auth.uid());

