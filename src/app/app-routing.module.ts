import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './Pages/home/home.component';
import {RegisterComponent} from './Pages/register/register.component';
import {LoginComponent} from './Pages/login/login.component';
import {MapComponent} from './Pages/map/map.component';
import {UserProfilComponent} from './Pages/user-profil/user-profil.component';
import {NotFound404Component} from './Pages/not-found404/not-found404.component';
import {AuthGuardService} from './Services/auth-guard.service';
import {ContactComponent} from './Pages/contact/contact.component';
import {LoggedGuardService} from './Services/logged-guard.service';
import {ResetPasswordComponent} from './Pages/reset-password/reset-password.component';
import {CguComponent} from './Pages/cgu/cgu.component';
import {LegalMentionComponent} from './Pages/legal-mention/legal-mention.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'congitions-generales-utilisation', component: CguComponent},
  {path: 'mentions-legales', component: LegalMentionComponent},
  {path: 'register',/* canActivate: [LoggedGuardService],*/ component: RegisterComponent},
  {path: 'login',/* canActivate: [LoggedGuardService],*/ component: LoginComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'user-profil', /*canActivate: [AuthGuardService],*/ component: UserProfilComponent},
  {path: 'map', /*canActivate: [AuthGuardService],*/ component: MapComponent},
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
