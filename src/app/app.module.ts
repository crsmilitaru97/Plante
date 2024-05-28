import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PlantDetailsComponent } from './plant-details/plant-details.component';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';

@NgModule({
  declarations: [
    AppComponent,
    PlantDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    InputTextareaModule,
    DialogModule,
    ImageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
