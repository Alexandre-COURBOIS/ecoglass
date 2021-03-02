import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptServiceService {


  privateKey = "080595030995310817";

  constructor() {
  }

  encode(value: string) {
    return CryptoJS.AES.encrypt(value.trim(), this.privateKey.trim()).toString();
  }

  decode(value: string) {
    return CryptoJS.AES.decrypt(value.trim(), this.privateKey.trim()).toString(CryptoJS.enc.Utf8);
  }

}
