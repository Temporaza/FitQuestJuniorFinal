import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 0 || !Number.isFinite(value)) {
      return 'N/A';
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = (value % 60).toFixed(2); // Format seconds to two decimal places

    return [
      hours > 0 ? `${hours}h` : '',
      minutes > 0 ? `${minutes}m` : '',
      `${seconds}s`, // Always include seconds with two decimal places
    ]
      .filter(Boolean)
      .join(' ');
  }
}
