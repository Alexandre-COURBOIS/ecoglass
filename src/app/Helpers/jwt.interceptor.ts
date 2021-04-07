import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../Services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService : AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("From interceptor : " + this.authService.getToken());
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });

    return next.handle(request);
  }
}
