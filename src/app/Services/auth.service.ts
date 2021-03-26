import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient : HttpClient, private cookieService : CookieService) { }

  public getToken(): string {
    return this.cookieService.get("_token");
  }

  public isAuthenticated() : boolean {
    const token = this.cookieService.get('_token');
    return tokenNotExpired('token',token);
  }

  login(email: string, password: string) {
    return this.httpClient.post(environment.API_URL + 'api/login_check', {username: email, password: password});
  }
}
