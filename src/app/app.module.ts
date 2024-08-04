import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { ColorPickerModule } from 'ngx-color-picker';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { firebaseConfig } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { PlantDetailsComponent } from './components/plant-details/plant-details.component';
import { SearchplantImageComponent } from './components/search-plant-image/search-plant-image.component';
import { AuthGuard } from './guards/auth.guard';
import { AccordionModule } from 'primeng/accordion';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    PlantDetailsComponent,
    SearchplantImageComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    [RouterModule.forRoot(routes)],

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,

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
    ToastModule,
    TabViewModule,
    ImageModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ProgressSpinnerModule,
    MenuModule,
    AccordionModule,
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }


