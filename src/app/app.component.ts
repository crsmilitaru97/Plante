import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Plante';
  dialogDetailsVisible: boolean = false;

  doFileInput(event: any) {
    console.log(event);

  }

  editPlant() {
    this.dialogDetailsVisible = true;
  }

  addPlant() {
    this.dialogDetailsVisible = true;
  }

  cancelEdit() {
    this.dialogDetailsVisible = false;
  }
  
  save(planta: any){
    planta.id = UUID.generate();
  }
}

