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

  marimi = marimi;
  culori = culori;
  organe = organe;

  constructor(private db: AngularFireDatabase,
    private messageService: MessageService,
    private geolocation: GeolocationService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
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
        this.db.object('plante/' + this.planta.id).remove();
        this.db.object('detalii/' + this.planta.id).remove();
        this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Planta a fost ștearsă cu succes!' });
        this.cancel.emit();
      },
      reject: () => {
      }
    });
  }

  onSave() {
    if (!this.planta.id || this.planta.id == '') {
      delete (this.planta.imageURL);
      const imgFile = this.planta.imageFile;
      delete (this.planta.imageFile);
      const imgPreview = this.planta.imagePreview;
      delete (this.planta.imagePreview);

      this.planta.id = generateGuid();
      this.db.object('detalii/' + this.planta.id).set(this.planta);

      const previewPlanta = {
        denumireStintifica: this.planta.denumireStintifica,
        denumirePopulara: this.planta.denumirePopulara
      }
      this.db.object('plante/' + this.planta.id).set(previewPlanta);

      this.setLocation(this.planta.id);
      this.uploadFileToFirebase('preview', previewPlanta, this.planta.id, imgPreview, 'plante');
      this.uploadFileToFirebase('imagine', this.planta, this.planta.id, imgFile, 'detalii');

      this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Planta a fost salvată cu succes!' });
    }
    else {
      const previewPlanta = {
        denumireStintifica: this.planta.denumireStintifica,
        denumirePopulara: this.planta.denumirePopulara
      }
      this.db.object('plante/' + this.planta.id).update(previewPlanta);
      this.db.object('detalii/' + this.planta.id).update(this.planta);
      this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Detaliile plantei au fost modificate cu succes!' });
    }
    this.save.emit(this.planta);
  }

  addOrganPicture(organSelectat: any) {

  }

  async uploadFileToFirebase(path: string, planta: any, id: string, file: File, outputPath: string) {
    const storage = getStorage();
    const storageRef = ref(storage, `${path}/${id}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      planta[path] = downloadURL;
      await this.db.object(outputPath + '/' + id).update(planta);
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
      this.db.object('detalii/' + idPlanta).update(this.planta);
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
        this.planta[this.selectedOrganValue].imagine = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }
}