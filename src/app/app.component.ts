import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import 'firebase/database';
import { organe, setAllOrgans } from './components/utils';

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
  viewType: string = 'grid';
  dialogSearchPlantVisible: boolean = false;
  organe = organe;

  constructor(
    private db: AngularFireDatabase,
  ) { }

  ngOnInit(): void {
    this.loadData();

    if (window.screen.width < 1000) {
      this.viewType = 'list';
    }
  }

  loadData() {
    this.db.object('plante').valueChanges().subscribe((plante: any) => {
      if (plante) {
        this.plante = Object.values(plante);
        for (let i = 0; i < this.plante.length; i++) {
          this.plante[i].id = Object.keys(plante)[i];
        }
      }
    });
  }

  editPlant(selectata: any) {
    this.db.object('detalii/' + selectata.id).valueChanges()
      .subscribe((plant: any) => {
        if (plant) {
          this.plantaSelectata = plant;
          setAllOrgans(this.plantaSelectata);
          this.dialogDetailsVisible = true;
        }
      });
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

  changeViewType() {
    if (this.viewType === "list") {
      this.viewType = "grid";
    }
    else this.viewType = "list";
  }
}

