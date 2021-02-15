import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private httpClient: HttpClient) {
  }


  sendMailForForgotPassword(email: string) {
    return this.httpClient.post(environment.API_URL + 'forgot/password', {email: email});
  }

  getTokenInformations(token: string, date: string | null) {
    return this.httpClient.post(environment.API_URL + 'reset/password', {token: token, date: date});
  }

  updatePasswordForgot(email: string, password: string, passwordVerif: string) {
    return this.httpClient.post(environment.API_URL + 'reset-password/update-password', {
      email: email,
      password: password,
      verifPassword: passwordVerif
    });
  }
}
