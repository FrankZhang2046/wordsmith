import { Component, effect, inject } from '@angular/core';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { WordService } from '../../services/word.service';
import { WordStats } from '../../models/word-entry.model';

@Component({
  selector: 'app-chart-view-widget',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './chart-view-widget.component.html',
  styleUrl: './chart-view-widget.component.scss',
})
export class ChartViewWidgetComponent {
  private wordService = inject(WordService);
  public single: { name: string; value: number }[] = [];

  view: [number, number] = [350, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  legendPosition = LegendPosition.Below;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {
    effect(() => {
      const result = this.wordService.wordBankEntriesSignal().reduce(
        (acc: { [key: string]: number }, cur: WordStats) => {
          acc[cur.masteryLevel] += 1;
          return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      );
      const finalResult: { name: string; value: number }[] = [];
      Object.keys(result).forEach((key) => {
        const name = `lv. ${key}`;
        if (result[key] > 0) {
          finalResult.push({ name, value: result[key] });
        }
      });

      this.single = finalResult;
    });
  }
}
