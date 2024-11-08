import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Importar el entorno


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/v1/auth`; // Usar la variable de entorno
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getTokenPayload());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
      .pipe(map(user => {
        // almacenar detalles del usuario y token jwt en el local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(this.getTokenPayload());
        return user;
      }));
  }

  logout() {
    // eliminar usuario del local storage para cerrar sesión
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, { token, newPassword });
  }

  getToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser).token;
    }
    return null;
  }

  private getTokenPayload(): any {
    const token = this.getToken();
    if (token) {
      try {
        const payload = atob(token.split('.')[1]);
        return JSON.parse(payload);
      } catch (e) {
        console.error('Error parsing token payload', e);
        return null;
      }
    }
    return null;
  }
}
