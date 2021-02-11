import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
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
import {AuthGuardService} from './Services/auth-guard.service';
import {ContactComponent} from './Pages/contact/contact.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'user-profil', /*canActivate: [AuthGuardService],*/ component: UserProfilComponent},
  {path: 'map', /*canActivate: [AuthGuardService],*/ component: MapComponent},
  {path: 'update-user', /*canActivate: [AuthGuardService],*/ component: UpdateUserComponent},
  {path: 'update-user/personnal-informations', /*canActivate: [AuthGuardService],*/ component: UpdateUserPersonnalInformationsComponent},
  {path: 'update-user/contact-informations', /*canActivate: [AuthGuardService],*/ component: UpdateUserPersonnalInformationsComponent},
  {path: 'update-user/password', /*canActivate: [AuthGuardService],*/ component: UpdateUserPasswordComponent},
  {path: '404NotFound', component: NotFound404Component},
  {path: '', redirectTo: 'user-profil', pathMatch: 'full'},
  {path: '**', redirectTo: '404NotFound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
