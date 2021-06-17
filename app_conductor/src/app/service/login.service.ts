import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public currentUser: Observable<User>;

  user: any;

  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public login(dni: string, password: string): void {
    this.http
      .post(environment.apiURL + 'login', {
        dni,
        password,
      })
      .subscribe((data) => {
        this.user = data;
        if (this.user.status === 'success') {
          if (
            this.user.data.role === 'Conductor' ||
            this.user.data.email === 'guirudj007@gmail.com' ||
            this.user.data.email === 'javier@gmail.com'
          ) {
            localStorage.setItem('currentUser', JSON.stringify(this.user.data));
            this.currentUserSubject.next(this.user.data);
            this.router.navigate(['home']);
          } else {
            alert('El usuario no tiene permisos para usar la app');
          }
        } else {
          console.log('No se ha encontrado el usuario');
        }
      });
  }

  public logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    try {
      this.http.post<any>(`${environment.apiURL}logout`, null);
    } catch (error) {}
    this.router.navigate(['']);
  }
}
