import { Component, OnInit } from '@angular/core';
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { GameContextService } from "../services/game-context.service";
import { NgIf } from "@angular/common";
import { LoadingState } from "../enums/loading-state.enum";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FileUploadComponent,
    LineChartComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  gameContextLoadingState: LoadingState = LoadingState.None;
  constructor(public gameContextService: GameContextService) {}

  ngOnInit(): void {
      this.gameContextService.gameContextLoadingSubject.subscribe(loadingState => {
        this.gameContextLoadingState = loadingState;
      })
  }
  onFileSelected(file: File) {
    this.gameContextService.loadFileToGameContext(file);
  }

  protected readonly LoadingState = LoadingState;
}
