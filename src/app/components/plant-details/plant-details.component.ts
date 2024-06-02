import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { culori, generateGuid, marimi, organe } from '../utils';

@Component({
  selector: 'plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss']
})
export class PlantDetailsComponent implements OnInit {
  @Input() public planta: any = {};
  @Output() public cancel = new EventEmitter();
  @Output() public save = new EventEmitter<any>();
  selectedOrganValue = organe[0].value;
  database: string = 'prod';

  marimi = marimi;
  culori = culori;
  organe = organe;

  constructor(private db: AngularFireDatabase,
    private messageService: MessageService,
    private geolocation: GeolocationService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
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
    if (!this.planta.id || this.planta.id == '') {
      this.planta.id = generateGuid();
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
        denumireStintifica: this.planta.denumireStintifica,
        denumirePopulara: this.planta.denumirePopulara
      }
      this.db.object(planteDatabase).set(previewPlanta);

      //this.setLocation(this.planta.id);
      this.uploadFileToFirebase('preview', previewPlanta, this.planta.id, imgPreview, planteDatabase);
      this.uploadFileToFirebase('imagine', this.planta, this.planta.id, imgFile, detaliiDatabase);

      this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Planta a fost salvată cu succes!' });
    }
    else {
      const detaliiDatabase = `${this.database}/detalii/${this.planta.id}`;
      const planteDatabase = `${this.database}/plante/${this.planta.id}`;

      const previewPlanta = {
        denumireStintifica: this.planta.denumireStintifica,
        denumirePopulara: this.planta.denumirePopulara
      }
      this.db.object(planteDatabase).update(previewPlanta);
      this.db.object(detaliiDatabase).update(this.planta);
      this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Detaliile plantei au fost modificate cu succes!' });
    }

    const detaliiDatabase = `${this.database}/detalii/${this.planta.id}`;
    this.organe.forEach(organ => {
      if (this.planta[organ.value].imageFile) {
        this.addOrganPicture(organ.value, this.planta, detaliiDatabase);
      }
    });

    this.save.emit(this.planta);
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
    }
  }

  deletePhoto(imagine: any) {

  }
}