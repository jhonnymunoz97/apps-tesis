//import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptorService {
  constructor(/* private authenticationService: AuthService */) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    /* const currentUser = this.authenticationService.currentUserValue; */
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    //if (currentUser && currentUser.access_token) {
    if (currentUser != null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.access_token}`,
        },
      });
    }

    return next.handle(request);
  }
}
