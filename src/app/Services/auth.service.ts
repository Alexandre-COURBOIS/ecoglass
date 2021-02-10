import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient : HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post(environment.API_URL + 'api/login_check', {username: email, password: password});
  }
}
