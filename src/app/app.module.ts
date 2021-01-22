import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { MapComponent } from './Pages/map/map.component';
import { RegisterComponent } from './Pages/register/register.component';
import { UpdateUserComponent } from './Pages/update-user/update-user.component';
import { UpdateUserPersonnalInformationsComponent } from './Pages/update-user/update-user-personnal-informations/update-user-personnal-informations.component';
import { UpdateUserContactInformationsComponent } from './Pages/update-user/update-user-contact-informations/update-user-contact-informations.component';
import { UpdateUserPasswordComponent } from './Pages/update-user/update-user-password/update-user-password.component';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { UserProfilComponent } from './Pages/user-profil/user-profil.component';
import { NotFound404Component } from './Pages/not-found404/not-found404.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MapComponent,
    RegisterComponent,
    UpdateUserComponent,
    UpdateUserPersonnalInformationsComponent,
    UpdateUserContactInformationsComponent,
    UpdateUserPasswordComponent,
    ForgotPasswordComponent,
    UserProfilComponent,
    NotFound404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
