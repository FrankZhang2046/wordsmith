import { Pipe, PipeTransform } from '@angular/core';
import { InstructorFeedback } from '../models/instructor-feedback.model';

@Pipe({
  name: 'resolveFbBgColorPipeTs',
  standalone: true,
})
export class ResolveFbBgColorPipeTsPipe implements PipeTransform {
  transform(feedback: InstructorFeedback | undefined): string {
    if (feedback) {
      switch (feedback.correct) {
        case true:
          return 'bg-green-400';
        case false:
          return 'bg-red-400';
        default:
          return '';
      }
    } else {
      return '';
    }
  }
}
