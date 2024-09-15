import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecaseWithSpaces',
  standalone: true
})
export class TitlecaseWithSpacesPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
  }
}
