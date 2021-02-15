import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ResetPasswordService} from '../../Services/reset-password.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private resetPasswordService: ResetPasswordService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    const token = this.route.snapshot.params['token'];

    if (token && token.length === 86) {
      const date = new Date();
      const formatDate = this.datePipe.transform(date, 'Y-MM-d HH:mm:ss');

      this.resetPasswordService.getTokenInformations(token, formatDate).subscribe(value => {
        console.log(value);
        if (value === 200) {
          console.log('ok');
        } else {
          this.router.navigate(['/404NotFound']);
        }
      }, error => {
        this.router.navigate(['/404NotFound']);
      });
    } else {
      this.router.navigate(['/404NotFound']);
    }

  }

}
