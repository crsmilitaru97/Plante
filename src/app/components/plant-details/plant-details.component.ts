import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MessageService } from 'primeng/api';
import { generateGuid } from '../utils';

@Component({
  selector: 'plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss']
})
export class PlantDetailsComponent implements OnInit {
  @Input() public planta: any = {};
  @Output() public cancel = new EventEmitter();
  @Output() public save = new EventEmitter<any>();

  marimi = ['Foarte mică', 'Mică', 'Medie', 'Mare', 'Foarte mare'];
  culori = ["#FFFFFF", "#000000", "#FF0000", "#008000", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#808080", "#800000", "#808000", "#000080",
    "#800080", "#008080", "#C0C0C0", "#00FF00", "#00FFFF", "#FF00FF", "#FFA500", "#A52A2A", "#FFC0CB", "#FFD700", "#F5F5DC", "#FF7F50", "#40E0D0"
  ];
  organe = ['Floare', 'Fruct', 'Frunză', 'Tulpină'];


  constructor(private db: AngularFireDatabase,
    private messageService: MessageService,
    private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit(): void {
    this.planta = {};
  }

  doFileInput(event: any) {
    console.log(event);

  }

  cancelEdit() {
    this.cancel.emit();
  }

  saveEdit() {
    this.planta.id = generateGuid();

    this.uploadFileToFirebase('preview', this.planta.id, this.planta.imageFile);
    this.uploadFileToFirebase('imagine', this.planta.id, this.planta.imageFile);
    delete (this.planta.imageFile);

    this.db.object('plante/' + this.planta.id).set(this.planta);

    this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Planta a fost salvată cu succes!' });

    this.save.emit(this.planta);
  }

  async uploadFileToFirebase(path: string, id: string, file: File) {
    const storage = getStorage();
    const storageRef = ref(storage, `${path}/${id}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      this.planta[path] = downloadURL;
      this.db.object('plante/' + id).update(this.planta);

    } catch (error) {
      console.error('Upload failed', error);
    }
  }
}