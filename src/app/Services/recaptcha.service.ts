import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  constructor(private httpClient: HttpClient) {
  }

  testToken(token: string) {
    return this.httpClient.post(environment.API_URL + 'recaptcha/validate', {
      recaptcha: token
    });
  }

}
