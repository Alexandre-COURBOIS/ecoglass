import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ResetPasswordService} from '../../Services/reset-password.service';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  email !: string;
  submitted = false;
  clicked = false;

  forgotPasswordForm = new FormGroup({
    password: new FormControl(), verifPassword: new FormControl()
  });

  constructor(private route: ActivatedRoute, private router: Router, private resetPasswordService: ResetPasswordService, private datePipe: DatePipe,
              private toastr: ToastrService, private formBuilder: FormBuilder, private ngxService: NgxUiLoaderService) {
  }

  ngOnInit() {
    const token = this.route.snapshot.params['token'];

    if (token && token.length === 86) {
      const date = new Date();
      const formatDate = this.datePipe.transform(date, 'Y-MM-d HH:mm:ss');

      this.resetPasswordService.getTokenInformations(token, formatDate).subscribe(value => {
        if (value) {
          // @ts-ignore
          this.email = value;
          this.initForm();
        } else {
          this.toastr.error('Ce token semble expiré ! Veuillez renouvelez votre demande', 'ça remonte tout ça..');
          this.router.navigate(['/404NotFound']);
        }
      }, error => {
        this.toastr.error('Ce token semble expiré ! Veuillez renouvelez votre demande', 'ça remonte tout ça..');
        this.router.navigate(['/404NotFound']);
      });
    } else {
      this.router.navigate(['/404NotFound']);
    }
  }

  initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!.:,;^%*?&µù%=&])[A-Za-z\d$@$!.:,;^%*?&µù%=&].{8,}')]],
      verifPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!.:,;^%*?&µù%=&])[A-Za-z\d$@$!.:,;^%*?&µù%=&].{8,}')]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.clicked = true;

    if (this.forgotPasswordForm.valid) {

      this.ngxService.startLoader('loader-01');

      const typedPassword = this.forgotPasswordForm.get('password')?.value;
      const typedVerifPassword = this.forgotPasswordForm.get('verifPassword')?.value;

      if (typedPassword === typedVerifPassword) {

        this.resetPasswordService.updatePasswordForgot(this.email, typedPassword, typedVerifPassword).subscribe(
          value => {

            // @ts-ignore
            this.toastr.success(value, 'Félicitations !');
            this.router.navigate(['/login']);
            this.ngxService.stopLoader('loader-01');
          }, error => {
            this.toastr.error(error.error, 'Oups une erreur !');
            this.ngxService.stopLoader('loader-01');
          });
      } else {
        this.toastr.error('Les mots de passe saisis ne correspondent pas', 'Une petite erreur !');
        this.ngxService.stopLoader('loader-01');
      }
    } else {
      this.toastr.error('Le formulaire est vide, ou il manque des informations, veuillez le compléter !', 'Une petite erreur !');
    }
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

}
