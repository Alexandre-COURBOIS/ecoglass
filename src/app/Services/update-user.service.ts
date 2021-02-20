import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserService {

  constructor(private httpClient: HttpClient) { }

  updateGeneralInformations(name: string, surname: string,pseudo: string, email: string ) {
    return this.httpClient.put(environment.API_URL + 'api/user/update/personnal/informations', {
      name: name,
      surname: surname,
      pseudo: pseudo,
      email: email
    });

  }


    updateDetailsInformations(address: string, postalCode: bigint, city: string) {
      return this.httpClient.put(environment.API_URL + 'api/user/update/contact/informations', {
        address: address,
        city: city,
        postalCode: postalCode,
      });
    }


  }
