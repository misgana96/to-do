import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get the authentication token from Supabase
 */
async function getAuthToken(): Promise<string | null> {
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Unknown error',
      message: `HTTP ${response.status}`
    }));
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
}

// Task API functions
export const taskApi = {
  /**
   * Get all tasks with optional filters
   */
  async getTasks(filters?: {
    completed?: boolean;
    priority?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) {
    const params = new URLSearchParams();
    if (filters?.completed !== undefined) {
      params.append('completed', String(filters.completed));
    }
    if (filters?.priority) {
      params.append('priority', filters.priority);
    }
    if (filters?.sort_by) {
      params.append('sort_by', filters.sort_by);
    }
    if (filters?.sort_order) {
      params.append('sort_order', filters.sort_order);
    }

    const queryString = params.toString();
    return apiRequest<{ tasks: Task[]; count: number }>(
      `/api/tasks${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get a single task by ID
   */
  async getTask(id: string) {
    return apiRequest<{ task: Task }>(`/api/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  async createTask(task: CreateTaskInput) {
    return apiRequest<{ message: string; task: Task }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    });
  },

  /**
   * Update a task
   */
  async updateTask(id: string, updates: UpdateTaskInput) {
    return apiRequest<{ message: string; task: Task }>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string) {
    return apiRequest<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE'
    });
  }
};

// Types
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}

