import { AfterViewInit, Component, ViewChild } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { GameContextService } from "../../services/game-context.service";
import { Hand } from "../../interfaces/hand.model";

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  imports: [
    NgChartsModule
  ]
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      title: {
        display: true,
        text: "Hands won"
      },
      legend: {
        display: false
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  constructor(public gameContextService: GameContextService) {
  }

  ngAfterViewInit(): void {
    this.gameContextService.gameContextSubject.subscribe(gameContext => {
      this.pieChartData.labels = gameContext.players.map(player => player.name);
      this.pieChartData.datasets = [
        {
          data: gameContext.players.map(player => {
            return gameContext.hands.reduce((accumulator: number, currHand: Hand) => {
              if ((currHand.players.find(p => p.id === player.id)?.grossProfitLoss ?? 0) > 0.001) {
                return accumulator + 1;
              } else {
                return accumulator;
              }
            }, 0);
          })
        }
      ];
      this.chart?.update();
    })
  }
}

// public pieChartOptions: ChartConfiguration['options'] = {
//   plugins: {
//     legend: {
//       display: true,
//       position: 'top',
//     },
//     datalabels: {
//       formatter: (value: any, ctx: any) => {
//         if (ctx.chart.data.labels) {
//           return ctx.chart.data.labels[ctx.dataIndex];
//         }
//       },
//     },
//   },
// };
// public pieChartData: ChartData<'pie', number[], string | string[]> = {
//   labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
//   datasets: [
//     {
//       data: [300, 500, 100],
//     },
//   ],
// };
