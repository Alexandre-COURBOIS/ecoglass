import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import jwtDecode from 'jwt-decode';
import {UserService} from '../../Services/user.service';
import {CookieService} from 'ngx-cookie-service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ResetPasswordService} from '../../Services/reset-password.service';
import {EncryptServiceService} from '../../Services/encrypt-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username !: string;
  closeResult = '';
  submitted = false;
  submittedReset = false;
  authForm = new FormGroup({email: new FormControl(), password: new FormControl()});
  resetPasswordForm = new FormGroup({email: new FormControl()});


  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private toastr: ToastrService,
              private ngxService: NgxUiLoaderService, private userService: UserService, private cookieService: CookieService, private modalService: NgbModal,
              private resetPasswordService: ResetPasswordService, private encryptService: EncryptServiceService) {
  }

  ngOnInit() {
    this.initForm();
    this.initPasswordResetForm();
  }

  initForm() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!.:,;^%*?&µù%=&])[A-Za-z\d$@$!.:,;^%*?&µù%=&].{8,}')]]
    });
  }

  initPasswordResetForm() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
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
            var encodedStatus = this.encryptService.encode("true");
            // @ts-ignore
            this.cookieService.set('_logged', encodedStatus);
            // @ts-ignore
            this.cookieService.set('_id', user.id);
            // @ts-ignore
            this.cookieService.set('_name', user.name);
            // @ts-ignore
            this.cookieService.set('_surname', user.surname);
            // @ts-ignore
            this.cookieService.set('_pseudo', user.pseudo);
            // @ts-ignore
            var encodedMail = this.encryptService.encode(user.email);
            // @ts-ignore
            this.cookieService.set('_email', encodedMail);
            // @ts-ignore
            this.cookieService.set('_city', user.city);
            // @ts-ignore
            this.cookieService.set('_address', user.address);
            // @ts-ignore
            this.cookieService.set('_postalCode', user.postalCode);

            this.router.navigate(['']).then(logged => {
              // @ts-ignore

              let logValue = this.encryptService.encode("true");

              sessionStorage.setItem('firstLog', logValue);

              window.location.reload();

            });
          }, error => {
            this.submitted = false;
          });

          this.ngxService.stopLoader('loader-01');

        }, error => {
          if (error.error.message) {
            this.submitted = false;
            this.toastr.error('Email ou mot de passe incorrect');
            this.submitted = false;
          }
          this.ngxService.stopLoader('loader-01');
        });
      } else {
        this.toastr.error('Tiens ? Les informations renseignées ne sont pas correct !', 'Oups une erreur ?');
        this.ngxService.stopLoader('loader-01');
        this.submitted = false;
      }
    } else {
      this.toastr.error('Il semblerait que le formulaire n\'est pas renseigné correctement !', 'Oups une erreur ?');
      this.ngxService.stopLoader('loader-01');
      this.submitted = false;
    }
  }

  submitResetPassWordForm() {

    this.submittedReset = true;
    if (this.resetPasswordForm.valid) {

      const email = this.resetPasswordForm.get('email')?.value;

      if (email) {
        this.resetPasswordService.sendMailForForgotPassword(email).subscribe(value => {
          // @ts-ignore
          this.toastr.success(value, 'Allez voir vos mails !');
        }, error => {
          this.toastr.error(error.error, 'Apparemment il y a un problème !');
        });
      }
    }
  }

// Modal

  // @ts-ignore
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  get f() {
    return this.authForm.controls;
  }

  get fp() {
    return this.resetPasswordForm.controls;
  }



}
