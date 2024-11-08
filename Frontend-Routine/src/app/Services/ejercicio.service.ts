import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment'; // Importar el entorno

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {
  private baseUrl = `${environment.apiUrl}/api/v1/ejercicios`; // Usar la variable de entorno

  constructor(private http: HttpClient, private authService: AuthService) { }

  getEjercicios(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.baseUrl, { headers });
  }

  createEjercicio(ejercicio: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, ejercicio, { headers });
  }

  getEjercicioById(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  updateEjercicio(id: number, ejercicio: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/${id}`, ejercicio, { headers });
  }

  deleteEjercicio(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}
