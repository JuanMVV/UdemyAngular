import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //necesitamos crear un emit para que la pag pueda escuchar lo que esta devolviendo el servicio y poder mandarselo
  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient,
    private cookieService: CookieService) { }

  login(request: LoginRequest): Observable<LoginResponse>  {
    return this.http.post<LoginResponse>('https://localhost:7296/api/auth/login', {
      email: request.email,
      password: request.password
    });    
  }


  setUser(user: User):void {
    this.$user.next(user);
    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));
  }


  //navbar estara escuchando este observable
  user(): Observable<User | undefined>{
    return this.$user.asObservable();
  }


  getUser(): User | undefined{
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');

    if(email && roles){
      const user : User = {
        email: email,
        roles: roles.split(',')
      };
      return user;
    }

    return undefined;
  }


  //creamos un servicio para el logout
  logout(): void {
    //limpiamos los datos 
    localStorage.clear();
    //eliminamos todo
    this.cookieService.delete('Authorization', '/');
    //setiamos como vacio 
    this.$user.next(undefined);

  }








}
