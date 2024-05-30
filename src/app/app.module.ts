import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlantDetailsComponent } from './components/plant-details/plant-details.component';
import { SearchplantImageComponent } from './components/search-plant-image/search-plant-image.component';

const firebaseConfig = {
  apiKey: "AIzaSyCl1FBtBcDb_wfZpQH-zbmB0ffgWXpn35A",
  authDomain: "plante-6e20f.firebaseapp.com",
  databaseURL: "https://plante-6e20f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plante-6e20f",
  storageBucket: "plante-6e20f.appspot.com",
  messagingSenderId: "206298724136",
  appId: "1:206298724136:web:ad2c40dee43521af45c21d"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

@NgModule({
  declarations: [
    AppComponent,
    PlantDetailsComponent,
    SearchplantImageComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),

    AngularFireDatabaseModule,

    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    InputTextareaModule,
    DialogModule,
    ImageModule,
    DataViewModule,
    ToastModule
  ],
  providers: [MessageService, NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule { }


