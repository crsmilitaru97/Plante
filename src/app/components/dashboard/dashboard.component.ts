import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import 'firebase/database';
import { AuthService } from 'src/app/services/auth.service';
import { culori, marginiFrunze, marimi, organe, tipFlori, tipFructe, tipFrunze, tipTulpini } from '../nomenclatoare';
import { fetchImage, setAllOrgans } from '../utils';

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
  addFilterDialogVisible: boolean = false;
  organe = organe;
  isLoading: boolean = true;
  database: string = 'prod';
  isSmallScreen: boolean = false;
  filter = {
    denumire: '',
    criterii: [] as any
  }
  userItems = [
    {
      label: 'Deconectare', icon: 'pi pi-sign-out', command: () => { this.signOut(); }
    },
  ];
  planteDetaliate: any;

  marimi = marimi;
  culori = culori;


  tipFrunze = tipFrunze;
  marginiFrunze = marginiFrunze;
  tipFructe = tipFructe;
  tipTulpini = tipTulpini;
  tipFlori = tipFlori;
  tip: any = tipFlori;

  newFilter: any = {};

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
        this.filteredPlants = [...this.plante];
        this.loadAllImages();
        this.isLoading = false;
      } else {
        console.log("No plants available");
      }
    }).catch((error: any) => {
      console.error("Error fetching data:", error);
    });

    this.loadDetailedPlants();
  }

  async loadAllImages() {
    for (const plant of this.plante) {
      plant.downloadedImage = await fetchImage(plant.preview);
    }
  }

  loadDetailedPlants() {
    this.db.object(this.database + '/detalii').query.get().then((dataSnapshot: any) => {
      if (dataSnapshot.exists()) {
        const data = dataSnapshot.val();
        this.planteDetaliate = Object.values(data);
      }
    }).catch((error: any) => {
      console.error("Error fetching data:", error);
    });
  }


  filterDetailedPlants() {
    this.filteredPlants = [...this.plante];
    if (this.filter) {
      let plante = this.planteDetaliate?.filter((e: any) => e.denumireStintifica?.includes(this.filter.denumire) || e.denumirePopulara?.includes(this.filter.denumire));
      this.filter.criterii.forEach((criteriu: any) => {
        if (criteriu.culoare)
          plante = plante?.filter((e: any) => e[criteriu.organ]?.culoare == (criteriu.culoare));
        if (criteriu.marime)
          plante = plante?.filter((e: any) => e[criteriu.organ]?.marime == (criteriu.marime));
        if (criteriu.tip)
          plante = plante?.filter((e: any) => e[criteriu.organ]?.tip == (criteriu.tip));
      });
      this.filteredPlants = this.filteredPlants?.filter(e => plante.some((p: { id: any; }) => p.id === e.id));
    }
  }

  editPlant(selectata: any) {
    this.closeDialogs();
    const subscription = this.db.object(this.database + '/detalii/' + selectata.id).valueChanges()
      .subscribe((plant: any) => {
        if (plant) {
          this.plantaSelectata = plant;
          setAllOrgans(this.plantaSelectata);
          this.dialogDetailsVisible = true;

          // Unsubscribe after processing the value
          subscription.unsubscribe();
        }
      });
  }

  addPlant() {
    this.plantaSelectata = {};
    this.dialogSearchPlantVisible = true;
  }

  addFilter() {
    this.newFilter = {};
    this.addFilterDialogVisible = true;
  }

  addNewFilter() {
    this.closeDialogs();
    this.newFilter.label = this.newFilter.organ;
    if (this.newFilter.marime || this.newFilter.tip)
      this.newFilter.label += ` - `;

    if (this.newFilter.marime)
      this.newFilter.label += `Mărime ${this.newFilter.marime.toLowerCase()}`
    if (this.newFilter.tip)
      this.newFilter.label += (this.newFilter.marime ? ', ' : '') + `Tip ${this.newFilter.tip.toLowerCase()}`

    this.newFilter.label = this.newFilter.label.charAt(0).toUpperCase() + this.newFilter.label.slice(1);
    this.filter.criterii.push(this.newFilter);
  }

  closeDialogs() {
    this.dialogDetailsVisible = false;
    this.dialogSearchPlantVisible = false;
    this.addFilterDialogVisible = false;
  }

  removeCheckbox(item: any) {
    this.filter.criterii = this.filter.criterii.filter((criteriu: any) => criteriu !== item);
  }

  save(event: any) {
    if (event) {
      this.plante.push(event);
    }
    this.dialogDetailsVisible = false;
  }

  modify(event: any) {
    if (event) {
      const index = this.plante.findIndex((e: any) => e.id === event.id);
      if (index !== -1) {
        this.plante[index].denumireStintifica = event.denumireStintifica;
        this.plante[index].denumirePopulara = event.denumirePopulara;
      }
    }
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

  selectOrgan(event: any) {
    switch (event.value) {
      case 'frunză':
        this.tip = tipFrunze;
        break;
      case 'fruct':
        this.tip = tipFructe;
        break;
      case 'floare':
        this.tip = tipFlori;
        break;
      case 'tulpină':
        this.tip = tipTulpini;
        break;
      default:
        this.tip = [];
        break;
    }
  }
}

