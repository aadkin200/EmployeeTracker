import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user'

type LoginRequest = { email: string; password: string };
type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, payload)
      .pipe(tap((res) => localStorage.setItem('token', res.token)));
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  createUser(payload: any) {
      console.log('made it to service');
      console.log(payload);
      return this.http.post<User>(`${this.apiUrl}/auth/register`, payload);
    }
}
