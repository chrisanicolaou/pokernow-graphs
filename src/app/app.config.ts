import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { GameContextService } from "./services/game-context.service";
import { ChartService } from "./services/chart.service";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), GameContextService, ChartService],
};
