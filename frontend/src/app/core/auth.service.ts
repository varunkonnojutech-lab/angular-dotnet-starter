import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Must match the HTTPS port printed by `dotnet run` in backend/.
  private readonly apiUrl = 'https://localhost:7299/api';
  private readonly tokenKey = 'jwt_token';
  private readonly loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  readonly isLoggedIn: Observable<boolean> = this.loggedIn$.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, { username, password })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn$.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return this.getToken() !== null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn$.next(true);
  }
}
