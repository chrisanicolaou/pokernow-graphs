import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { NgChartsConfiguration, NgChartsModule } from "ng2-charts";

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgChartsModule],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false }}
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Output() fileSelectedEvent = new EventEmitter<File>();

  onFileSelected($event: Event) {
    let selected = ($event.target as any)?.files[0] as File;
    this.fileSelectedEvent.emit(selected);
  }
}


// how to make this thing work:
// 1. User submits their csv
// 2. Validate the csv is in the format expected from pokernow (entry/at/order)
// 3. Chuck away any events not required for visualisation. Any that include:
//// - Requested a seat
//// - The admin approved
//// - The game's small/big blind/ante was changed
//// -
// 4. Find each block of rows starting with "-- starting hand #x" and ending with "--ending hand #x".
// 5. Use these blocks to create a "Hand" object. This will contain:
//// - Hand winner + winnings
//// - Each other player's losses
//// - (Optionally include more data here if we wanted to allow round-by-round visualisations/highlights. Like pre-flop action etc)
// 6. Figure out how to track players while they are away so as to not ruin the graphs
//
