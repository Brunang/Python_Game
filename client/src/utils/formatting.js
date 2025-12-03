// Formatting utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatScore = (score) => {
  return `${Math.round(score)}%`;
};

export const truncateText = (text, length = 50) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatLevelNumber = (number) => {
  return `Level ${number}`;
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: '#10b981',
    Medium: '#f59e0b',
    Hard: '#ef4444',
    Expert: '#8b5cf6',
  };
  return colors[difficulty] || '#gray';
};
