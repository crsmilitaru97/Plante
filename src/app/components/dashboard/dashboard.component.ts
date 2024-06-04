import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import 'firebase/database';
import { AuthService } from 'src/app/services/auth.service';
import { organe } from '../nomenclatoare';
import { setAllOrgans } from '../utils';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'Plante';
  dialogDetailsVisible: boolean = false;
  plante: any[] = [];
  filteredPlants: any[] = [];
  mostRecentPlants: any[] = [];
  plantaSelectata: any;
  viewType: string = 'grid';
  dialogSearchPlantVisible: boolean = false;
  organe = organe;
  isLoading: boolean = true;
  database: string = 'prod';
  isSmallScreen: boolean = false;
  filter = {
    denumireStintifica: '',
    denumirePopulara: '',
  }
  userItems = [
    {
      label: 'Deconectare', icon: 'pi pi-sign-out', command: () => { this.signOut(); }
    },
  ];

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isSmallScreen = window.screen.width < 1000;
    this.database = window.location.href.includes('localhost') ? 'test' : 'prod';
    this.loadData();

    if (this.isSmallScreen) {
      this.viewType = 'list';
    }
  }

  signOut() {
    this.authService.signOut()
      .then(res => {
        this.router.navigate(['/login']);
      })
      .catch(err => {
        console.log('Logout error: ', err);
      });
  }

  loadData() {
    this.isLoading = true;

    // this.db.object(this.database + '/plante').query.limitToLast(this.isSmallScreen ? 3 : 6).orderByChild('data').get().then((dataSnapshot: any) => {
    //   if (dataSnapshot.exists()) {
    //     const data = dataSnapshot.val();
    //     this.mostRecentPlants = Object.values(data);
    //     for (let i = 0; i < this.mostRecentPlants.length; i++) {
    //       this.mostRecentPlants[i].id = Object.keys(data)[i];
    //     }
    //     this.isLoading = false;
    //   } else {
    //     console.log("No recent plants available");
    //   }
    // }).catch((error: any) => {
    //   console.error("Error fetching data:", error);
    // });

    this.db.object(this.database + '/plante').query.get().then((dataSnapshot: any) => {
      if (dataSnapshot.exists()) {
        const data = dataSnapshot.val();
        this.plante = Object.values(data);
        for (let i = 0; i < this.plante.length; i++) {
          this.plante[i].id = Object.keys(data)[i];
        }
        this.filterPlants();
        this.isLoading = false;
      } else {
        console.log("No recent plants available");
      }
    }).catch((error: any) => {
      console.error("Error fetching data:", error);
    });
  }

  filterPlants() {
    this.filteredPlants = [...this.plante];
    if (this.filter.denumireStintifica)
      this.filteredPlants = this.filteredPlants.filter(e => e.denumireStintifica.toLowerCase().includes(this.filter.denumireStintifica.toLowerCase()));
    if (this.filter.denumirePopulara)
      this.filteredPlants = this.filteredPlants.filter(e => e.denumirePopulara.toLowerCase().includes(this.filter.denumirePopulara.toLowerCase()));
  }


  editPlant(selectata: any) {

    this.db.object(this.database + '/detalii/' + selectata.id).valueChanges()
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

  save(event: any) {
    this.dialogDetailsVisible = false;
  }

  continueSaving(event: any) {
    this.dialogSearchPlantVisible = false;
    this.dialogDetailsVisible = true;
    this.plantaSelectata = event;
  }

  changeViewType() {
    if (this.viewType === "list") {
      this.viewType = "grid";
    }
    else this.viewType = "list";
  }
}

