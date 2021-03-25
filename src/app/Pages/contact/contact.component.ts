import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ContactService} from '../../Services/contact.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {RecaptchaService} from "../../Services/recaptcha.service";


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  submitted = false;
  recaptchaVerif: Object = false;
  contactForm = new FormGroup({
    prenom: new FormControl(), nom: new FormControl(),
    email: new FormControl(), message: new FormControl()
  });

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private contactService: ContactService,
              private ngxService: NgxUiLoaderService, private recaptchaService: RecaptchaService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.contactForm = this.formBuilder.group({
      prenom:  ['', Validators.required],
      nom:     ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.valid) {

      this.ngxService.startLoader('loader-01');

      const prenom = this.contactForm.get('prenom')?.value;
      const nom = this.contactForm.get('nom')?.value;
      const email = this.contactForm.get('email')?.value;
      const message = this.contactForm.get('message')?.value;

      if (prenom && nom && email && message) {

        this.contactService.sendContactMessage(prenom, nom, email, message).subscribe(value => {
          this.submitted = false;
          // @ts-ignore
          this.toastr.success(value,'Votre message a bien été envoyé');
          this.contactForm.reset()
          this.ngxService.stopLoader('loader-01');
          this.contactForm.reset();
          grecaptcha.reset();
          this.recaptchaVerif = false;
        }, error => {
          this.submitted = false;
          this.ngxService.stopLoader('loader-01');
        });

      } else {
        this.toastr.error("Merci de renseigner correctement le formulaire", "Oups une erreur ?!")
      }
    } else {
      this.toastr.error("Merci de renseigner correctement le formulaire", "Oups une erreur ?!")
    }
  }

  resolved(captchaResponse: string) {
    this.recaptchaService.testToken(captchaResponse).subscribe(value => {
      this.recaptchaVerif = value;
    })
  }
}
