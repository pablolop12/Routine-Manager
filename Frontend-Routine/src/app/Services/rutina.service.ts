import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment'; // Importar el entorno

@Injectable({
  providedIn: 'root'
})
export class RutinaService {
  private baseUrl = `${environment.apiUrl}/api/v1/rutinas`; // Usar la variable de entorno

  constructor(private http: HttpClient, private authService: AuthService) { }

  createRutina(rutina: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, rutina, { headers });
  }

  getActiveRutina(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/active`, { headers });
  }

  activateRutina(rutinaId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/${rutinaId}/activate`, {}, { headers });
  }

  getRutinasByUser(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.baseUrl, { headers });
  }

  deleteRutina(rutinaId: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${rutinaId}`, { headers });
  }

  getRutinaById(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  updateRutina(id: number, rutina: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/${id}`, rutina, { headers });
  }
}
