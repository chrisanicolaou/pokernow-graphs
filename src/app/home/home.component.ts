import { Component, OnInit } from '@angular/core';
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { GameContextService } from "../services/game-context.service";
import { NgForOf, NgIf } from "@angular/common";
import { LoadingState } from "../enums/loading-state.enum";
import { MatButtonModule } from "@angular/material/button";
import { GameContext } from "../interfaces/game-context.model";
import { Player } from "../interfaces/player.model";
import { Subject } from "rxjs";
import { PieChartComponent } from "./pie-chart/pie-chart.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FileUploadComponent,
    LineChartComponent,
    NgIf,
    MatButtonModule,
    NgForOf,
    PieChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  protected readonly LoadingState = LoadingState;
  playersToFilterBySubject: Subject<Player[]> = new Subject<Player[]>();
  gameContextLoadingState: LoadingState = LoadingState.None;
  gameContext: GameContext = { players: [], hands: [] }
  playersToFilterBy: Player[] = [];
  constructor(public gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.gameContextService.gameContextSubject.subscribe(gameContext => {
      this.gameContext = gameContext;
    });
    this.gameContextService.gameContextLoadingSubject.subscribe(loadingState => {
      this.gameContextLoadingState = loadingState;
    })
  }
  onFileSelected(file: File) {
    this.gameContextService.loadFileToGameContext(file);
  }

  filterByPlayerClicked(player: Player) {
    let indexOfPlayerInFilter = this.playersToFilterBy.findIndex(p => p.id === player.id);
    if (indexOfPlayerInFilter > -1) {
      this.playersToFilterBy.splice(indexOfPlayerInFilter, 1);
    } else {
      this.playersToFilterBy.push(player);
    }
    this.playersToFilterBySubject.next(this.playersToFilterBy);
  }

  isPlayerInFilter(player: Player): boolean {
    return this.playersToFilterBy.findIndex(p => p.id === player.id) > -1;
  }
}
