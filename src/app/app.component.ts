import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import 'firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Plante';
  dialogDetailsVisible: boolean = false;
  plante: any[] = [];
  plantaSelectata: any;
  mobile: boolean = false;
  dialogSearchPlantVisible: boolean = false;

  constructor(
    private db: AngularFireDatabase,
  ) { }

  ngOnInit(): void {
    this.loadData();

    //if (window.screen.width < 1000) {
    this.mobile = true;
    //}
  }

  loadData() {
    this.db.object('plante').valueChanges().subscribe((plante: any) => {
      if (plante) {
        this.plante = Object.values(plante);
      }
    });
  }

  editPlant(plant: any) {
    this.plantaSelectata = plant;
    this.dialogDetailsVisible = true;
  }

  addPlant() {
    this.plantaSelectata = {};
    this.dialogSearchPlantVisible = true;
  }

  closeDialogs() {
    this.dialogDetailsVisible = false;
    this.dialogSearchPlantVisible = false;
  }

  save(planta: any) {

    this.dialogDetailsVisible = false;

  }
}

