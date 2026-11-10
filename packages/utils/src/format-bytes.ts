const bytesPerUnit = 1024;
const byteUnits = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatBytes(bytes: number): string {
  let unitIndex = 0;
  let value = bytes;
  while (Math.abs(value) >= bytesPerUnit && unitIndex < byteUnits.length - 1) {
    value /= bytesPerUnit;
    unitIndex++;
  }
  let rounded = Math.round(value * 10) / 10;
  if (Math.abs(rounded) >= bytesPerUnit && unitIndex < byteUnits.length - 1) {
    rounded = Math.round((rounded / bytesPerUnit) * 10) / 10;
    unitIndex++;
  }
  return `${rounded} ${byteUnits[unitIndex]}`;
}
