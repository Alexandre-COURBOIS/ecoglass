import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService) {
  }

  // @ts-ignore
  canActivate(): Observable<boolean> | Promise<Boolean> | Boolean {

    return new Promise(resolve => {

        let loggedStatus = this.cookieService.get('_logged');
        let jwtToken = this.cookieService.get('_token');
        let username = this.cookieService.get('_email');

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
