import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import {EncryptServiceService} from './encrypt-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService, private encryptService: EncryptServiceService) {
  }

  // @ts-ignore
  canActivate(): Observable<boolean> | Promise<Boolean> | Boolean {

    return new Promise(resolve => {

        let logged = this.cookieService.get('_logged');
        let loggedStatus = this.encryptService.decode(logged);
        let jwtToken = this.cookieService.get('_token');
        let mail = this.cookieService.get('_email');
        let username = this.encryptService.decode(mail);

        // @ts-ignore
        if (loggedStatus === 'true' && jwtDecode(jwtToken).username === username) {
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      }
    );
  }
}
