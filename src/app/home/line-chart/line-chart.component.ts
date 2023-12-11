import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import { MatButtonModule } from "@angular/material/button";
import Annotation from 'chartjs-plugin-annotation';
import {NgForOf} from "@angular/common";
import { GameContext } from "../../interfaces/game-context.model";
import { GameContextService } from "../../services/game-context.service";
import { ChartService } from "../../services/chart.service";
import { Player } from "../../interfaces/player.model";
import { Subject } from "rxjs";

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
export class LineChartComponent implements AfterViewInit {
  @Input() filterSubject: Subject<Player[]> = new Subject<Player[]>();
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
      x: {
        title: {
          display: true,
          text: "Hands played"
        }
      },
      y: {
        ticks: {
          callback: (value, index, ticks) =>  value as number >= 0 ? `$${value}` : `-$${Math.abs(value as number)}`
        },
        title: {
          display: true,
          text: "Loss | Profit"
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Player winnings"
      }
    }
  };

  private _gameContext: GameContext | undefined;

  constructor(public gameContextService: GameContextService, public chartService: ChartService) {
    Chart.register(Annotation);
  }

  ngAfterViewInit(): void {
    this.gameContextService.gameContextSubject.subscribe(gameContext => {
      this._gameContext = gameContext;
      this.regenerateChartData(gameContext);
    });
    this.filterSubject.subscribe(playersToFilterBy => this.filterByPlayers(playersToFilterBy));
  }

  private regenerateChartData(gameContext: GameContext) {
    this.chartData.xLabels = gameContext.hands.map(hand => hand.index);
    this.chartData.datasets = gameContext.players.map(player => {
      return {
        data: gameContext.hands.map(hand => hand.players.find(p => p.id === player.id)?.netProfitLoss ?? 0),
        label: player.name,
        pointStyle: false,
      }
    });
    this.chart?.update();
  }

  public filterByPlayers(players: Player[]) {
    if (!this._gameContext) return;

    if (players.length < 1) {
      this.regenerateChartData(this._gameContext);
      return;
    }

    this.chartData.datasets = players.map(player => {
      return {
        data: this._gameContext!.hands.map(hand => hand.players.find(p => p.id === player.id)?.netProfitLoss ?? 0),
        label: player.name,
        pointStyle: false,
        // This was ugly - nice idea tho for once I have a theme
        // backgroundColor: this.getRandomColor(),
        fill: "origin"
      }
    })
    this.chart?.update();
  }

  // sample events
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
