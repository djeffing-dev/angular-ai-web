import { RegisterRequest } from './../../models/registerRequest';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environement } from '../../../environments/environment';
import { Observable, retry, tap } from 'rxjs';
import { JwtResponse } from '../../models/jwtResponse';
import { LoginRequest } from '../../models/loginRequest';
import { UserResponse } from '../../models/userResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = `${environement.apiUrl}/auth`
  constructor(private http: HttpClient) { }

  signin = (loginRequest : LoginRequest):Observable<JwtResponse> =>{
    return this.http.post<JwtResponse>(`${this.url}/signin`, loginRequest).pipe(
      retry(3),
      tap(response =>{localStorage.setItem("token", response.token)}) // Ajout du token dans le localStorage
    )
  }

  register(registerRequest: RegisterRequest):Observable<UserResponse>{
    return this.http.post<UserResponse>(`${this.url}/signup`, registerRequest);
  }


}
