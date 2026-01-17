import {Pipe, PipeTransform} from '@angular/core';
import {LabelService} from '../shared/services/label.service';

@Pipe({
  standalone: false,name: 'label'})
export class LabelPipe implements PipeTransform {
  constructor(private labelService: LabelService) {}

  transform(value: string): string {
      return this.labelService.get(value);
  }
}
