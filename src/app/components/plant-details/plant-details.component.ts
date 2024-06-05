import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { culori, marginiFrunze, marimi, organe, tipFlori, tipFructe, tipFrunze, tipTulpini } from '../nomenclatoare';

@Component({
  selector: 'plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss']
})
export class PlantDetailsComponent implements OnInit {
  @Input() public planta: any = {};
  @Output() public cancel = new EventEmitter();
  @Output() public save = new EventEmitter<any>();
  @Output() public modify = new EventEmitter<any>();

  isSmallScreen: boolean = false;

  tipFrunze = tipFrunze;
  marginiFrunze = marginiFrunze;
  tipFructe = tipFructe;
  tipTulpini = tipTulpini;
  tipFlori = tipFlori;
  tip: any = tipFlori;

  selectedOrganValue = organe[0].value;
  database: string = 'prod';
  isLoadingSave: boolean = false;

  marimi = marimi;
  culori = culori;
  organe = organe;

  constructor(private db: AngularFireDatabase,
    private messageService: MessageService,
    private authService: AuthService,
    private geolocation: GeolocationService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.isSmallScreen = window.screen.width < 1000;
    this.database = window.location.href.includes('localhost') ? 'test' : 'prod';
    this.planta = {};
  }

  onCancel() {
    this.cancel.emit();
  }

  onDelete() {
    this.confirmationService.confirm({
      header: 'Sunteți sigur?',
      message: 'Sunteți sigur că doriți să ștergeți această plantă?',
      accept: () => {
        const detaliiDatabase = `${this.database}/detalii/${this.planta.id}`;
        const planteDatabase = `${this.database}/plante/${this.planta.id}`;
        this.db.object(planteDatabase).remove();
        this.db.object(detaliiDatabase).remove();
        this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Planta a fost ștearsă cu succes!' });
        this.cancel.emit();
      },
      reject: () => {
      }
    });
  }

  onSave() {
    this.isLoadingSave = true;
    if (!this.planta.id || this.planta.id == '') {
      this.planta.id = this.db.createPushId();
      this.planta.data = new Date();

      delete (this.planta.imageURL);
      const imgFile = this.planta.imageFile;
      delete (this.planta.imageFile);
      const imgPreview = this.planta.imagePreview;
      delete (this.planta.imagePreview);

      const detaliiDatabase = `${this.database}/detalii/${this.planta.id}`;
      const planteDatabase = `${this.database}/plante/${this.planta.id}`;

      this.db.object(detaliiDatabase).set(this.planta);

      const previewPlanta = {
        id: this.planta.id,
        denumireStintifica: this.planta.denumireStintifica,
        denumirePopulara: this.planta.denumirePopulara
      }
      this.db.object(planteDatabase).set(previewPlanta);
      this.uploadFileToFirebase('preview', previewPlanta, this.planta.id, imgPreview, planteDatabase);

      //this.setLocation(this.planta.id);
      this.uploadFileToFirebase('imagine', this.planta, this.planta.id, imgFile, detaliiDatabase);

      this.authService.getDisplayName().then(name => {
        this.planta.adaugataDe = name;
        this.db.object(detaliiDatabase).update(this.planta);
      });

      this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Planta a fost salvată cu succes!' });
    }
    else {
      const detaliiDatabase = `${this.database}/detalii/${this.planta.id}`;
      const planteDatabase = `${this.database}/plante/${this.planta.id}`;

      const previewPlanta = {
        id: this.planta.id,
        denumireStintifica: this.planta.denumireStintifica,
        denumirePopulara: this.planta.denumirePopulara
      }
      this.db.object(planteDatabase).update(previewPlanta);
      this.db.object(detaliiDatabase).update(this.planta);
      this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Detaliile plantei au fost modificate cu succes!' });
      this.modify.emit(previewPlanta);
      this.isLoadingSave = false;
    }

    const detaliiDatabase = `${this.database}/detalii/${this.planta.id}`;
    this.organe.forEach((organ: any) => {
      if (this.planta[organ.value].imageFile) {
        this.addOrganPicture(organ.value, this.planta, detaliiDatabase);
      }
    });
  }

  async addOrganPicture(organSelectat: string, planta: any, outputPath: string) {
    const storage = getStorage();
    const storageRef = ref(storage, `organe/${planta.id}/${organSelectat}`);

    try {
      const snapshot = await uploadBytes(storageRef, planta[organSelectat].imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      delete (planta[organSelectat].imageFile);
      planta[organSelectat].imagine = downloadURL;
      await this.db.object(outputPath).update(planta);
    } catch (error) {
      console.error('Upload failed', error);
    }
  }

  async uploadFileToFirebase(path: string, planta: any, id: string, file: File, outputPath: string) {
    const storage = getStorage();
    const storageRef = ref(storage, `${path}/${id}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      planta[path] = downloadURL;
      await this.db.object(outputPath).update(planta);
      if (path == 'preview') {
        this.save.emit(planta);
        this.isLoadingSave = false;
      }
    } catch (error) {
      console.error('Upload failed', error);
    }
  }

  async setLocation(idPlanta: string) {
    this.geolocation.getCurrentPosition().subscribe((loc: any) => {
      this.planta.locatie = {
        longitudine: loc.coords.longitude,
        latitudine: loc.coords.latitude,
      }
      this.db.object(this.database + '/detalii/' + idPlanta).update(this.planta);
    });
  }

  selectTab(event: any) {
    this.selectedOrganValue = this.organe[event.index].value;
    switch (this.selectedOrganValue) {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.planta[this.selectedOrganValue].imageFile = file;
        this.planta[this.selectedOrganValue].imagine = e.target?.result;
      };
      reader.readAsDataURL(file);
      input.value = '';
    }
  }

  deletePhoto(imagine: any) {

  }
}