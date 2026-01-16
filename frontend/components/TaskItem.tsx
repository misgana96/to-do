'use client';

import { Task } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete
}: TaskItemProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue =
    task.due_date &&
    !task.completed &&
    new Date(task.due_date) < new Date();

  return (
    <div
      className={`bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 ${
        task.completed
          ? 'border-gray-300 opacity-60'
          : isOverdue
          ? 'border-red-500'
          : 'border-blue-500'
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggleComplete}
          className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3
                className={`text-lg font-semibold mb-1 ${
                  task.completed
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm mb-2 ${
                    task.completed
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>

                {task.due_date && (
                  <span
                    className={`text-xs ${
                      isOverdue
                        ? 'text-red-600 dark:text-red-400 font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    📅 {formatDate(task.due_date)}
                    {isOverdue && ' (Overdue)'}
                  </span>
                )}

                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Created: {formatDate(task.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Edit task"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

