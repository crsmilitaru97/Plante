import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'search-plant-image',
  templateUrl: './search-plant-image.component.html',
  styleUrls: ['./search-plant-image.component.scss']
})
export class SearchplantImageComponent implements OnInit {
  @Input() public planta: any = {};
  @Output() public cancel = new EventEmitter();
  @Output() public imageFile = new EventEmitter<any>();
  @ViewChild('imgPreview') imgPreview!: ElementRef;
  file: any = null;

  dialogDetailsVisible: boolean = false;

  ngOnInit(): void {
    this.planta = {};
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imgPreview.nativeElement.src = e.target?.result as string;
      };
      reader.readAsDataURL(this.file);
    }
  }

  continueSaving() {
    this.planta.imageFile = this.file;
    this.dialogDetailsVisible = true;
  }

  save(planta: any) {
    this.dialogDetailsVisible = false;
    this.imgPreview.nativeElement.src = '';
    this.cancel.emit();
  }
}

