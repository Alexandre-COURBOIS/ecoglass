import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {RegisterService} from '../../Services/register.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    surname: new FormControl(), name: new FormControl(), pseudo: new FormControl(),
    email: new FormControl(), address: new FormControl(), city: new FormControl(),
    postalCode: new FormControl(), password: new FormControl(), verifPassword: new FormControl()
  });

  submitted = false;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private registerService: RegisterService, private router: Router,
              private ngxService: NgxUiLoaderService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Za-z]+$')]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Za-z]+$')]],
      pseudo: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z0-9]+$')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      address: ['', [Validators.required, Validators.minLength(10),Validators.pattern('^[a-zA-Z0-9 _]*$')]],
      city: ['', [Validators.required, Validators.minLength(2),Validators.pattern('^[A-Za-z \-]+$')]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!.:,;^%*?&µù%=&])[A-Za-z\d$@$!.:,;^%*?&µù%=&].{8,}')]],
      verifPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!.:,;^%*?&µù%=&])[A-Za-z\d$@$!.:,;^%*?&µù%=&].{8,}')]],
    });
  }

  onSubmit() {

    this.submitted = true;

    if (this.registerForm.valid) {

      this.ngxService.startLoader('loader-01');

      const typedPassword = this.registerForm.get('password')?.value;
      const typedVerifPassword = this.registerForm.get('verifPassword')?.value;

      if (typedPassword === typedVerifPassword) {

        const name = this.registerForm.get('name')?.value;
        const surname = this.registerForm.get('surname')?.value;
        const pseudo = this.registerForm.get('pseudo')?.value;
        const email = this.registerForm.get('email')?.value;
        const address = this.registerForm.get('address')?.value;
        const city = this.registerForm.get('city')?.value;
        const postalCode = this.registerForm.get('postalCode')?.value;
        const password = this.registerForm.get('password')?.value;

        this.registerService.createNewUser(name, surname, pseudo, email, address, city, postalCode, password).subscribe(
          value => {
            this.toastr.success('Votre compte a bien été créer ! Connectez-vous !', 'Féliciations !');
            this.router.navigate(['/login']);
            this.ngxService.stopLoader('loader-01');
          }, error => {
            console.log(error);
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
    return this.registerForm.controls;
  }
}
