
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'On Track': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'At Risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Delayed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'On Hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Urgent': return 'text-red-600 dark:text-red-400';
    case 'High': return 'text-orange-600 dark:text-orange-400';
    case 'Medium': return 'text-blue-600 dark:text-blue-400';
    case 'Low': return 'text-green-600 dark:text-green-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

export const getProgressBarColor = (status: string) => {
  if (status === 'On Track' || status === 'Completed') {
    return 'bg-green-500';
  } else if (status === 'At Risk') {
    return 'bg-yellow-500';
  } else {
    return 'bg-red-500';
  }
};
