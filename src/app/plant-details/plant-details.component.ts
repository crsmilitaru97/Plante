import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'plant-details-root',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss']
})
export class PlantDetailsComponent implements OnInit {
  @Output() public cancel = new EventEmitter();
  @Output() public save = new EventEmitter<any>();

  title = 'Plante';
  planta: any = {};
  marimi = ['Foarte mică', 'Mică', 'Medie', 'Mare', 'Foarte mare'];
  culori = ["#FFFFFF", "#000000", "#FF0000", "#008000", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#808080", "#800000", "#808000", "#000080",
    "#800080", "#008080", "#C0C0C0", "#00FF00", "#00FFFF", "#FF00FF", "#FFA500", "#A52A2A", "#FFC0CB", "#FFD700", "#F5F5DC", "#FF7F50", "#40E0D0"
  ];
  ngOnInit(): void {
  }

  doFileInput(event: any) {
    console.log(event);

  }

  cancelEdit() {
    this.cancel.emit();
  }

  saveEdit() {
    this.save.emit(this.planta);
  }
}

