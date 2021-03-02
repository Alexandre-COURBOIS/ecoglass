import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ContainersService {

  constructor(private httpClient: HttpClient) { }

  getContainer() {
    return this.httpClient.get(environment.API_URL + 'api/container/get/database/glass');
  }
}
