export function convertHourToMinutos(hour: string) {
  const [hours, minutes] = hour.split(':').map(Number);
  const minutesAmout = hours * 60 + minutes;
  return minutesAmout;
}
