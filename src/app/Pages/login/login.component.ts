import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;
  authForm = new FormGroup({email: new FormControl(), password: new FormControl()});

  constructor(private formBuilder: FormBuilder, private router: Router, private toastr: ToastrService, private ngxService: NgxUiLoaderService) {
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

      this.ngxService.startLoader('loader-01')

      const email = this.authForm.get('email')?.value;
      const password = this.authForm.get('password')?.value;



    }
  }

  get f() {
    return this.authForm.controls;
  }

}
