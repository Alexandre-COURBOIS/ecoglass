import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logged = false;

  constructor(private cookieService: CookieService, private router : Router, private toastr: ToastrService) {
  }

  ngOnInit() {

    const jwt = this.cookieService.get('_token');
    const email = this.cookieService.get('_email');
    const surname = this.cookieService.get('_surname');

    // @ts-ignore
    if (this.cookieService.get('_logged') === 'true' && jwt && jwtDecode(jwt).username === email) {

      this.logged = true;

      if (sessionStorage.getItem('firstLog') === "0") {

        this.toastr.success('Bienvenue ' + surname);

        sessionStorage.setItem('firstLog', "1");
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
