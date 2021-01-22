import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './Pages/home/home.component';
import {RegisterComponent} from './Pages/register/register.component';
import {LoginComponent} from './Pages/login/login.component';
import {MapComponent} from './Pages/map/map.component';
import {ForgotPasswordComponent} from './Pages/forgot-password/forgot-password.component';
import {UserProfilComponent} from './Pages/user-profil/user-profil.component';
import {UpdateUserComponent} from './Pages/update-user/update-user.component';
import {UpdateUserPersonnalInformationsComponent} from './Pages/update-user/update-user-personnal-informations/update-user-personnal-informations.component';
import {UpdateUserPasswordComponent} from './Pages/update-user/update-user-password/update-user-password.component';
import {NotFound404Component} from './Pages/not-found404/not-found404.component';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'register', component:RegisterComponent },
  {path: 'login', component:LoginComponent },
  {path: 'forgot-password', component:ForgotPasswordComponent },
  {path: 'user-profil', component:UserProfilComponent },
  {path: 'map', component:MapComponent },
  {path: 'update-user', component:UpdateUserComponent },
  {path: 'update-user/personnal-informations', component:UpdateUserPersonnalInformationsComponent },
  {path: 'update-user/contact-informations', component:UpdateUserPersonnalInformationsComponent },
  {path: 'update-user/password', component:UpdateUserPasswordComponent },
  {path: '404NotFound', component: NotFound404Component},
  {path: '', redirectTo: 'user-profil', pathMatch: 'full'},
  {path: '**', redirectTo: '404NotFound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
