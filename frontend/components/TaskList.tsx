'use client';

import { useState } from 'react';
import { Task } from '@/lib/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updates: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskList({
  tasks,
  onUpdate,
  onDelete
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggleComplete = async (task: Task) => {
    await onUpdate(task.id, { completed: !task.completed });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = async (id: string, updates: any) => {
    await onUpdate(id, updates);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg mb-2">No tasks found</p>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        if (editingId === task.id) {
          return (
            <div
              key={task.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-blue-500"
            >
              <TaskForm
                initialData={{
                  title: task.title,
                  description: task.description || undefined,
                  due_date: task.due_date || undefined,
                  priority: task.priority
                }}
                onSubmit={(updates) => handleSaveEdit(task.id, updates)}
                onCancel={handleCancelEdit}
              />
            </div>
          );
        }

        return (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={() => handleToggleComplete(task)}
            onEdit={() => handleEdit(task.id)}
            onDelete={() => onDelete(task.id)}
          />
        );
      })}
    </div>
  );
}

