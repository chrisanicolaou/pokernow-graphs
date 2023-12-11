import { Injectable } from '@angular/core';
import { ChartConfiguration } from "chart.js";
import { GameContext } from "../interfaces/game-context.model";

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() { }

  populateDataFromGameContext(chartData: ChartConfiguration["data"], gameContext: GameContext) {
  }

}
