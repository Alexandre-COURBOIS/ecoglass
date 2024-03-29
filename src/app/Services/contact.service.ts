import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient: HttpClient) { }

  sendContactMessage(prenom: string, nom: string, email: string, message: string){
    return this.httpClient.post(environment.API_URL + 'contact/send/message', {nom: nom, prenom: prenom, email: email, message: message});
  }

}
