export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
  });
};