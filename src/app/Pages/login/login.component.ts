import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import jwtDecode from 'jwt-decode';
import {UserService} from '../../Services/user.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;
  authForm = new FormGroup({email: new FormControl(), password: new FormControl()});

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private toastr: ToastrService,
              private ngxService: NgxUiLoaderService, private userService: UserService, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.authForm.valid) {

      this.ngxService.startLoader('loader-01');

      const email = this.authForm.get('email')?.value;
      const password = this.authForm.get('password')?.value;

      if (email && password) {

        this.authService.login(email, password).subscribe((value) => {

          // @ts-ignore
          const JWTToken = value['token'];
          const JWTCookieName = '_token';

          this.cookieService.set(JWTCookieName, JWTToken);

          const decodedJWT = jwtDecode(JWTToken);
          // @ts-ignore
          const userEmail = decodedJWT.username;

          // @ts-ignore
          this.userService.getUserByEmail(userEmail).subscribe(user => {

            // @ts-ignore
            this.cookieService.set('_logged', true);
            // @ts-ignore
            this.cookieService.set('_id', user.id);
            // @ts-ignore
            this.cookieService.set('_name', user.name);
            // @ts-ignore
            this.cookieService.set('_surname', user.surname);
            // @ts-ignore
            this.cookieService.set('_pseudo', user.pseudo);
            // @ts-ignore
            this.cookieService.set('_email', user.email);
            // @ts-ignore
            this.cookieService.set('_city', user.city);
            // @ts-ignore
            this.cookieService.set('_address', user.address);
            // @ts-ignore
            this.cookieService.set('_postalCode', user.postalCode);

            this.router.navigate(['/user-profil']).then(logged => {
              // @ts-ignore
              this.toastr.success('Bienvenue ' + user.surname);

            });
          }, error => {
            console.log(error);
          });

          this.ngxService.stopLoader('loader-01');

        }, error => {
          if (error.error.message) {
            this.toastr.error('Email ou mot de passe incorrect');
          }
          this.ngxService.stopLoader('loader-01');
        });
      } else {
        this.toastr.error('Tiens ? Les informations renseignées ne sont pas correct !', 'Oups une erreur ?');
        this.ngxService.stopLoader('loader-01');
      }
    } else {
      this.toastr.error('Il semblerait que le formulaire n\'est pas renseigné correctement !', 'Oups une erreur ?');
      this.ngxService.stopLoader('loader-01');
    }
  }

  get f() {
    return this.authForm.controls;
  }

}
