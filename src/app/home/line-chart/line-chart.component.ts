import { Component, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import { MatButtonModule } from "@angular/material/button";
import Annotation from 'chartjs-plugin-annotation';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [
    MatButtonModule,
    NgChartsModule,
    NgForOf
  ],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public chartType: ChartType = 'line';
  public chartData: ChartConfiguration['data'] = {datasets: [], labels: [], xLabels: [], yLabels: []}
  public chartOpts: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },

    plugins: {
      legend: { display: true },
      annotation: {
        annotations: [
        ],
      },
    },
  };

  constructor() {
    Chart.register(Annotation);
  }

  // events
  public chartClicked({
                        event,
                        active,
                      }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
                        event,
                        active,
                      }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }
}

// public lineChartData: ChartConfiguration['data'] = {
//   datasets: [
//     {
//       data: [65, 59, 80, 81, 56, 55, 40],
//       label: 'Series A',
//       backgroundColor: 'rgba(148,159,177,0.2)',
//       borderColor: 'rgba(148,159,177,1)',
//       pointBackgroundColor: 'rgba(148,159,177,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(148,159,177,0.8)',
//       fill: 'origin',
//     },
//     {
//       data: [28, 48, 40, 19, 86, 27, 90],
//       label: 'Series B',
//       backgroundColor: 'rgba(77,83,96,0.2)',
//       borderColor: 'rgba(77,83,96,1)',
//       pointBackgroundColor: 'rgba(77,83,96,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(77,83,96,1)',
//       fill: 'origin',
//     },
//     {
//       data: [180, 480, 770, 90, 1000, 270, 400],
//       label: 'Series C',
//       yAxisID: 'y1',
//       backgroundColor: 'rgba(255,0,0,0.3)',
//       borderColor: 'red',
//       pointBackgroundColor: 'rgba(148,159,177,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(148,159,177,0.8)',
//       fill: 'origin',
//     },
//   ],
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
// };
//
// public lineChartOptions: ChartConfiguration['options'] = {
//   elements: {
//     line: {
//       tension: 0.5,
//     },
//   },
//   scales: {
//     // We use this empty structure as a placeholder for dynamic theming.
//     y: {
//       position: 'left',
//     },
//     y1: {
//       position: 'right',
//       grid: {
//         color: 'rgba(255,0,0,0.3)',
//       },
//       ticks: {
//         color: 'red',
//       },
//     },
//   },
//
//   plugins: {
//     legend: { display: true },
//     annotation: {
//       annotations: [
//         {
//           type: 'line',
//           scaleID: 'x',
//           value: 'March',
//           borderColor: 'orange',
//           borderWidth: 2,
//           label: {
//             display: true,
//             position: 'center',
//             color: 'orange',
//             content: 'LineAnno',
//             font: {
//               weight: 'bold',
//             },
//           },
//         },
//       ],
//     },
//   },
// };

