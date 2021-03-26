import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient: HttpClient) {
  }

  createNewUser(name: string, surname: string, pseudo: string, email: string, address: string, city: string, postalCode: bigint, password: string) {

    return this.httpClient.post(environment.API_URL + 'register/user', {
      name: name, surname: surname, pseudo: pseudo, email: email, address: address,
      city: city, postalCode: postalCode, password: password
    });
  }
}
