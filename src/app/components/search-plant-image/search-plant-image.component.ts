import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { b64toBlob, organe, resizeImage, setAllOrgans } from '../utils';

@Component({
  selector: 'search-plant-image',
  templateUrl: './search-plant-image.component.html',
  styleUrls: ['./search-plant-image.component.scss']
})
export class SearchplantImageComponent implements OnInit {
  @Input() public planta: any = {};
  @Output() public cancel = new EventEmitter();
  @Output() public imageFile = new EventEmitter<any>();
  organe = organe;

  dialogDetailsVisible: boolean = false;

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
        }
      };
      reader.readAsDataURL(file);
    }
  }

  continueSaving() {
    this.planta.id = '';
    setAllOrgans(this.planta);
    this.dialogDetailsVisible = true;
  }

  onSave(planta: any) {
    this.dialogDetailsVisible = false;
    this.cancel.emit();
  }
}

