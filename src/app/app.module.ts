import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './Pages/home/home.component';
import {LoginComponent} from './Pages/login/login.component';
import {MapComponent} from './Pages/map/map.component';
import {RegisterComponent} from './Pages/register/register.component';
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
import {LoggedGuardService} from './Services/logged-guard.service';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';
import {DatePipe} from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MapComponent,
    RegisterComponent,
    UserProfilComponent,
    NotFound404Component,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    AuthGuardService,
    LoggedGuardService,
    DatePipe,
    HeaderComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
