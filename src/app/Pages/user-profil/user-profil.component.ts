import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {EncryptServiceService} from '../../Services/encrypt-service.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UpdateUserService} from '../../Services/update-user.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css']
})
export class UserProfilComponent implements OnInit {

  submitted = false;
  surname !: string;
  name !: string;
  pseudo !: string;
  email !: string;
  address !: string;
  postalCode !: string;
  city !: string;
  closeResult = '';
  oldPassword !: string;
  newPassword !: string;
  verifNewPassword !: string;

  updateGeneralForm = new FormGroup({surname: new FormControl(), name: new FormControl(), pseudo: new FormControl(),
    email: new FormControl()});

  updateDetailsForm = new FormGroup({address: new FormControl(), city: new FormControl(),
    postalCode: new FormControl()});

  updatePasswordForm = new FormGroup({oldPassword : new FormControl(), newPassword: new FormControl(),
    verifNewPassword: new FormControl()});

  constructor(private cookieService : CookieService, private encryptService : EncryptServiceService, private formBuilder: FormBuilder, private toastService : ToastrService,
              private updateUserService: UpdateUserService, private router: Router, private ngxService: NgxUiLoaderService, private modalService: NgbModal) { }

  ngOnInit() {
    this.surname = this.cookieService.get('_surname');
    this.name = this.cookieService.get('_name');
    this.pseudo = this.cookieService.get('_pseudo');
    let decodeEmail = this.cookieService.get('_email');
    this.email = this.encryptService.decode(decodeEmail);
    this.address = this.cookieService.get('_address');
    this.postalCode = this.cookieService.get('_postalCode');
    this.city = this.cookieService.get('_city');


    this.generalForm();
    this.detailsForm();
    this.passwordForm();
  }

  generalForm() {
    this.updateGeneralForm = this.formBuilder.group({
      name: [this.name, [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Za-z]+$')]],
      surname: [this.surname, [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Za-z]+$')]],
      pseudo: [this.pseudo, [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z0-9]+$')]],
      email: [this.email, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  detailsForm() {
    this.updateDetailsForm = this.formBuilder.group({
      address: [this.address, [Validators.required, Validators.minLength(10), Validators.pattern('^[a-zA-Z0-9 _]*$')]],
      city: [this.city, [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Za-z \-]+$')]],
      postalCode: [this.postalCode, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  passwordForm() {
    this.updatePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!.:,;^%*?&µù%=&])[A-Za-z\d$@$!.:,;^%*?&µù%=&].{8,}')]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!.:,;^%*?&µù%=&])[A-Za-z\d$@$!.:,;^%*?&µù%=&].{8,}')]],
      verifNewPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!.:,;^%*?&µù%=&])[A-Za-z\d$@$!.:,;^%*?&µù%=&].{8,}')]],
    })
  }

  generalFormSubmit(){

    this.submitted = true;

    if (this.updateGeneralForm.valid) {

      this.ngxService.startLoader('loader-01');

      const surname = this.updateGeneralForm.get('surname')?.value;
      const name    = this.updateGeneralForm.get('name')?.value;
      const pseudo  = this.updateGeneralForm.get('pseudo')?.value;
      const email   = this.updateGeneralForm.get('email')?.value;

      if (this.email === email){

        this.updateUserService.updateGeneralInformations(name, surname,pseudo,email).subscribe(value => {

          this.submitted = false;
          // @ts-ignore
          this.toastService.success(value);
          this.cookieService.delete('_surname');
          this.cookieService.delete('_name');
          this.cookieService.delete('_pseudo');
          this.cookieService.delete('_email');
          this.cookieService.set('_surname', surname);
          this.cookieService.set('_name', name);
          this.cookieService.set('_pseudo', pseudo);
          const encodedEmail = this.encryptService.encode(email);
          this.cookieService.set('_email',encodedEmail);
          this.ngxService.stopLoader('loader-01');
        });

      } else {

        this.toastService.success("Un changement d'email necessite une reconnexion", "Merci de votre compréhension");
        this.updateUserService.updateGeneralInformations(name, surname,pseudo,email).subscribe(value => {
          // @ts-ignore
          this.toastService.success(value);
          this.cookieService.deleteAll();
          sessionStorage.clear();
          this.router.navigate(['/login']);
          this.ngxService.stopLoader('loader-01');

          setTimeout(function() {
            window.location.reload();
          },1000);
        },error => {

          this.submitted = false;
          this.toastService.error(error.error);
          this.ngxService.stopLoader('loader-01');
        });

      }
    } else {
      if (this.updateGeneralForm.controls.surname.errors) {
        this.toastService.error('Il semblerait que le prénom renseigné ne soit pas correct', 'Une erreur !');
      } else if (this.updateGeneralForm.controls.name.errors) {
        this.toastService.error('Il semblerait que le nom renseigné ne soit pas correct', 'Une erreur !')
      } else if (this.updateGeneralForm.controls.pseudo.errors) {
        this.toastService.error('Il semblerait que le pseudo renseigné ne soit pas correct', 'Une erreur !')
      } else if (this.updateGeneralForm.controls.mail.errors) {
        this.toastService.error('Il semblerait que le mail renseigné ne soit pas correct', 'Une erreur !')
      }
    }
  }

  detailsFormSubmit() {

    this.submitted = true;

    if (this.updateDetailsForm.valid) {

      this.ngxService.startLoader('loader-01');
      const address = this.updateDetailsForm.get('address')?.value;
      const postalCode    = this.updateDetailsForm.get('postalCode')?.value;
      const city  = this.updateDetailsForm.get('city')?.value;
      this.updateUserService.updateDetailsInformations(address,postalCode,city).subscribe(value => {

        this.submitted = false;
        // @ts-ignore
        this.toastService.success(value);
        this.cookieService.delete('_address');
        this.cookieService.delete('_postalCode');
        this.cookieService.delete('_city');
        this.cookieService.set('_address', address);
        this.cookieService.set('_postalCode', postalCode);
        this.cookieService.set('_city', city);
        this.ngxService.stopLoader('loader-01');
      }, error => {

        this.ngxService.stopLoader('loader-01');
        this.submitted = false;
        this.toastService.error(error.error);
      })
    } else {
      if (this.updateDetailsForm.controls.address.errors) {
        this.toastService.error('Il semblerait que l\'adresse renseignée ne soit pas correct', 'Une erreur !');
      } else if (this.updateDetailsForm.controls.city.errors) {
        this.toastService.error('Il semblerait que la ville renseigné ne soit pas correct', 'Une erreur !')
      } else if (this.updateDetailsForm.controls.postalCode.errors) {
        this.toastService.error('Il semblerait que le code postal renseigné ne soit pas correct', 'Une erreur !')
      }
    }
  }

  submitNewPassWordForm() {

    this.submitted = true;

    this.ngxService.startLoader('loader-01');

    if (this.updatePasswordForm.valid) {

      const oldPassword = this.updatePasswordForm.get('oldPassword')?.value;
      const newPassword = this.updatePasswordForm.get('newPassword')?.value;
      const newPasswordVerif = this.updatePasswordForm.get('verifNewPassword')?.value;

      if (newPassword.value === newPasswordVerif.value) {

        this.updateUserService.updatePasswordInformations(oldPassword, newPassword, newPasswordVerif).subscribe(
          value => {

            this.submitted = false;
            // @ts-ignore
            this.toastService.success(value);
            this.ngxService.stopLoader('loader-01');

            setTimeout(function() {
              window.location.reload();
            },2000);

          }, error => {
            this.submitted = false;
            this.toastService.error(error.error,"Une erreur ?");
            this.ngxService.stopLoader('loader-01');

            setTimeout(function() {
              window.location.reload();
            },2000);
          }
        );
      } else {
        this.ngxService.stopLoader('loader-01');
        this.toastService.error('Il semblerait que vos nouveaux mot de passe ne soient pas identiques !', "Une erreur ?");
      }
    } else {
      this.ngxService.stopLoader('loader-01');
      this.toastService.error('Merci de renseigner correctement le formulaire', 'Une erreur ?');
    }
  }

  get fp() {
    return this.updatePasswordForm.controls;
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


}
