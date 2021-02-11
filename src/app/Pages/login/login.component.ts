import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;
  authForm = new FormGroup({email: new FormControl(), password: new FormControl()});

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private toastr: ToastrService, private ngxService: NgxUiLoaderService) {
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

        this.authService.login(email, password).subscribe(value => {
          console.log(value);

          this.ngxService.stopLoader('loader-01');


          // stocker le jwt

          // faire l'intercepteur

          // Executer une requête pour récupérer les infos utilisateur

          // Stocker en storage où cookie les infos utilisateur

          // Rediriger vers le profil

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
