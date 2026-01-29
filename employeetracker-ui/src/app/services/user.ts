import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/user`;
  private _me$ = new BehaviorSubject<User | null>(null);
  me$ = this._me$.asObservable();

  constructor(private http: HttpClient) {}

  // --------- "me" endpoints ----------
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  updateMe(payload: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me`, payload);
  }

  deleteMe(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me`);
  }

  // --------- admin-ish endpoints ----------
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/dashboard`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUserById(id: number, payload: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, payload);
  }

  deleteUserById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  loadMe() {
    return this.getMe().subscribe((me) => this._me$.next(me));
  }

  clearMe() {
    this._me$.next(null);
  }

  setMe(me: User | null) {
    this._me$.next(me);
  }

  createUser(payload: any) {
    console.log('made it to service');
    console.log(payload);
    return this.http.post<User>(`${this.baseUrl}/auth/register`, payload);
  }
}
