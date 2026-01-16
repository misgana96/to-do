import { supabase } from '../config/supabase.js';

/**
 * Create a new task
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, due_date, priority, completed } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title,
        description: description || null,
        due_date: due_date || null,
        priority: priority || 'medium',
        completed: completed || false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tasks for the authenticated user
 * Supports filtering and sorting via query parameters
 */
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { completed, priority, sort_by, sort_order } = req.query;

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    // Filter by completion status
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      query = query.eq('completed', isCompleted);
    }

    // Filter by priority
    if (priority) {
      query = query.eq('priority', priority);
    }

    // Sorting
    const sortColumn = sort_by || 'created_at';
    const sortDirection = sort_order === 'asc' ? 'asc' : 'desc';
    query = query.order(sortColumn, { ascending: sortDirection === 'asc' });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      tasks: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not found',
          message: 'Task not found'
        });
      }
      throw error;
    }

    res.json({ task: data });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a task
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // First verify the task exists and belongs to the user
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingTask) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    }

    // Update the task
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Task updated successfully',
      task: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // First verify the task exists and belongs to the user
    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingTask) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

