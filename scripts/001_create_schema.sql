-- Talent Spark AI Database Schema
-- Creates all necessary tables with RLS policies

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Brand definition fields
  company_name TEXT,
  industry TEXT,
  target_audience TEXT,
  company_values TEXT[],
  tone TEXT,
  additional_info TEXT,
  role TEXT,
  level TEXT CHECK (level IN ('junior', 'middle', 'senior')),
  -- Public sharing
  public_id TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select_own" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tasks_select_public" ON public.tasks FOR SELECT USING (is_public = TRUE);
CREATE POLICY "tasks_insert_own" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_update_own" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tasks_delete_own" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Task sections table
CREATE TABLE IF NOT EXISTS public.task_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL CHECK (type IN ('requirements', 'deliverables', 'evaluation', 'time', 'note', 'text')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.task_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_sections_select" ON public.task_sections FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_sections.task_id AND (tasks.user_id = auth.uid() OR tasks.is_public = TRUE)));
CREATE POLICY "task_sections_insert" ON public.task_sections FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_sections.task_id AND tasks.user_id = auth.uid()));
CREATE POLICY "task_sections_update" ON public.task_sections FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_sections.task_id AND tasks.user_id = auth.uid()));
CREATE POLICY "task_sections_delete" ON public.task_sections FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_sections.task_id AND tasks.user_id = auth.uid()));

-- Task responses (candidate submissions)
CREATE TABLE IF NOT EXISTS public.task_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT,
  response_content TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  -- AI Analysis fields
  overall_score NUMERIC(3,1),
  fit_to_brand NUMERIC(3,1),
  creativity_score NUMERIC(3,1),
  technical_accuracy NUMERIC(3,1),
  strengths TEXT[],
  weaknesses TEXT[],
  ai_summary TEXT
);

ALTER TABLE public.task_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_responses_select" ON public.task_responses FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_responses.task_id AND tasks.user_id = auth.uid()));
CREATE POLICY "task_responses_insert_public" ON public.task_responses FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_responses.task_id AND tasks.is_public = TRUE));
CREATE POLICY "task_responses_insert_own" ON public.task_responses FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_responses.task_id AND tasks.user_id = auth.uid()));
CREATE POLICY "task_responses_update" ON public.task_responses FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_responses.task_id AND tasks.user_id = auth.uid()));
CREATE POLICY "task_responses_delete" ON public.task_responses FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_responses.task_id AND tasks.user_id = auth.uid()));

-- File attachments table
CREATE TABLE IF NOT EXISTS public.file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.task_responses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT attachment_belongs_to_task_or_response CHECK (task_id IS NOT NULL OR response_id IS NOT NULL)
);

ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "file_attachments_select" ON public.file_attachments FOR SELECT 
  USING (
    (task_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = file_attachments.task_id AND (tasks.user_id = auth.uid() OR tasks.is_public = TRUE)))
    OR
    (response_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.task_responses tr JOIN public.tasks t ON t.id = tr.task_id WHERE tr.id = file_attachments.response_id AND t.user_id = auth.uid()))
  );
CREATE POLICY "file_attachments_insert" ON public.file_attachments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "file_attachments_delete" ON public.file_attachments FOR DELETE 
  USING (
    (task_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = file_attachments.task_id AND tasks.user_id = auth.uid()))
    OR
    (response_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.task_responses tr JOIN public.tasks t ON t.id = tr.task_id WHERE tr.id = file_attachments.response_id AND t.user_id = auth.uid()))
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_public_id ON public.tasks(public_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_task_sections_task_id ON public.task_sections(task_id);
CREATE INDEX IF NOT EXISTS idx_task_responses_task_id ON public.task_responses(task_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_task_id ON public.file_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_response_id ON public.file_attachments(response_id);
