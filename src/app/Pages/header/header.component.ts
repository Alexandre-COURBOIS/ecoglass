import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {EncryptServiceService} from '../../Services/encrypt-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logged = false;
  surname!: string;

  constructor(private cookieService: CookieService, private router : Router, private toastr: ToastrService, private encryptService: EncryptServiceService) {
  }

  ngOnInit() {

    const jwt = this.cookieService.get('_token');
    const emailCookie = this.cookieService.get('_email');
    const email = this.encryptService.decode(emailCookie);
    const surname = this.cookieService.get('_surname');
    const log = sessionStorage.getItem('firstLog')

    this.surname = surname;

    // @ts-ignore
    if (this.encryptService.decode(this.cookieService.get('_logged')) === 'true' && jwt && jwtDecode(jwt).username === email) {

      this.logged = true;

      if (log) {
        // @ts-ignore
        if (this.encryptService.decode(log) === "true") {

          this.toastr.success('Bienvenue ' + surname);

          sessionStorage.setItem('firstLog', this.encryptService.encode("false"));
        }
      }
    }
  }

  logOut(){
    this.cookieService.deleteAll();
    this.router.navigate(['/login']).then(r => {
      window.location.reload();
    });

  }


}
