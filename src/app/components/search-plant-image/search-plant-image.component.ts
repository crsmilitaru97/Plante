import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { organe } from '../nomenclatoare';
import { b64toBlob, resizeImage, setAllOrgans } from '../utils';
import { compareImages } from '../photo-recognition';

@Component({
  selector: 'search-plant-image',
  templateUrl: './search-plant-image.component.html',
  styleUrls: ['./search-plant-image.component.scss']
})
export class SearchplantImageComponent implements OnInit {
  @Input() public planta: any = {};
  @Input() public plants: any = {};
  @Output() public continueSaving = new EventEmitter();
  @Output() public editPlant = new EventEmitter();

  organe = organe;
  similarPlants: any[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.planta = {};
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.planta.imageFile = file;
          this.planta.imageURL = e.target.result as string;
          const resizedImage = await resizeImage(e.target.result as string);
          this.planta.imagePreview = b64toBlob(resizedImage);
          this.comparePlants();
        }
      };
      reader.readAsDataURL(file);
      input.value = '';
    }
  }

  onContinueSaving() {
    this.planta.id = '';
    setAllOrgans(this.planta);
    this.continueSaving.emit(this.planta);
  }

  comparePlants() {
    this.isLoading = true;
    compareImages(this.planta.imageURL, this.plants).then(result => {
      this.similarPlants = result;
      this.isLoading = false;
    });
  }

  editSimilarPlant(selectedPlant: any) {
    this.editPlant.emit(selectedPlant);
  }
}

