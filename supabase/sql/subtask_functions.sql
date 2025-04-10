
-- Function to get subtasks for a task
CREATE OR REPLACE FUNCTION public.get_subtasks_for_task(task_id_param UUID)
RETURNS TABLE (
  id UUID,
  task_id UUID,
  title TEXT,
  completed BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.task_id, s.title, s.completed, s.created_at
  FROM public.subtasks s
  WHERE s.task_id = task_id_param
  ORDER BY s.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to create a subtask
CREATE OR REPLACE FUNCTION public.create_subtask(
  task_id_param UUID,
  title_param TEXT,
  completed_param BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id UUID,
  task_id UUID,
  title TEXT,
  completed BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.subtasks (task_id, title, completed)
  VALUES (task_id_param, title_param, completed_param)
  RETURNING subtasks.id INTO new_id;
  
  RETURN QUERY
  SELECT s.id, s.task_id, s.title, s.completed, s.created_at
  FROM public.subtasks s
  WHERE s.id = new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update a subtask
CREATE OR REPLACE FUNCTION public.update_subtask(
  id_param UUID,
  title_param TEXT DEFAULT NULL,
  completed_param BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.subtasks
  SET
    title = COALESCE(title_param, title),
    completed = COALESCE(completed_param, completed),
    updated_at = NOW()
  WHERE id = id_param;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to delete a subtask
CREATE OR REPLACE FUNCTION public.delete_subtask(id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM public.subtasks
  WHERE id = id_param;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
