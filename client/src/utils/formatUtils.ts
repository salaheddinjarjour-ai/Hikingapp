export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatPace(kmPerHour: number): string {
  if (kmPerHour === 0) return '--';
  const minPerKm = 60 / kmPerHour;
  const mins = Math.floor(minPerKm);
  const secs = Math.round((minPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatElevation(meters: number): string {
  return `${Math.round(meters).toLocaleString()} m`;
}

export function formatCalories(calories: number): string {
  return `${Math.round(calories).toLocaleString()} kcal`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function formatDifficulty(difficulty: string): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400 bg-green-400/10 border-green-400/30';
    case 'moderate':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    case 'hard':
      return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    case 'expert':
      return 'text-red-400 bg-red-400/10 border-red-400/30';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
}

export function getWeatherIcon(condition: string): string {
  switch (condition) {
    case 'sunny':
      return '☀️';
    case 'cloudy':
      return '☁️';
    case 'rainy':
      return '🌧️';
    case 'snowy':
      return '❄️';
    case 'foggy':
      return '🌫️';
    case 'stormy':
      return '⛈️';
    default:
      return '🌤️';
  }
}
