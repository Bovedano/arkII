/** Formats a duration in seconds as "M:SS", e.g. 83 -> "1:23". */
export function formatTime(sec: number): string {
  const total = Math.round(sec);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
