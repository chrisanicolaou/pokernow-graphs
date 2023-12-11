import { Injectable } from '@angular/core';
import { ChartConfiguration } from "chart.js";
import { GameContext } from "../interfaces/game-context.model";

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() { }

  populateDataFromGameContext(chartData: ChartConfiguration["data"], gameContext: GameContext) {
    chartData.xLabels = gameContext.hands.map(hand => hand.index);
    chartData.datasets = gameContext.players.map(player => {
      return {
        data: gameContext.hands.map(hand => hand.players.find(p => p.id === player.id)?.netProfitLoss ?? 0),
        label: player.name
      }
    });
  }

}
