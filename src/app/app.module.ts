import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './Pages/home/home.component';
import {LoginComponent} from './Pages/login/login.component';
import {MapComponent} from './Pages/map/map.component';
import {RegisterComponent} from './Pages/register/register.component';
import {UpdateUserComponent} from './Pages/update-user/update-user.component';
import {UpdateUserPersonnalInformationsComponent} from './Pages/update-user/update-user-personnal-informations/update-user-personnal-informations.component';
import {UpdateUserContactInformationsComponent} from './Pages/update-user/update-user-contact-informations/update-user-contact-informations.component';
import {UpdateUserPasswordComponent} from './Pages/update-user/update-user-password/update-user-password.component';
import {ForgotPasswordComponent} from './Pages/forgot-password/forgot-password.component';
import {UserProfilComponent} from './Pages/user-profil/user-profil.component';
import {NotFound404Component} from './Pages/not-found404/not-found404.component';
import {HeaderComponent} from './Pages/header/header.component';
import {FooterComponent} from './Pages/footer/footer.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import {JwtInterceptor} from './Helpers/jwt.interceptor';
import {AuthGuardService} from './Services/auth-guard.service';
import { ContactComponent } from './Pages/contact/contact.component';


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
    NotFound404Component,
    HeaderComponent,
    FooterComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    NgxUiLoaderModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    AuthGuardService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
