export default function dateFormatter(date: string): string {
  const now = new Date(date);

  const years = now.getFullYear();
  const months = now.getMonth() + 1;
  const dates = now.getDate();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return `${years}-${months}-${dates} ${hours}:${minutes}:${seconds}`;
}
