import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment'; // Importar el entorno

@Injectable({
  providedIn: 'root'
})
export class DietaService {
  private baseUrl = `${environment.apiUrl}/api/v1/dietas`; // Usar la variable de entorno

  constructor(private http: HttpClient, private authService: AuthService) { }

  createDieta(dieta: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, dieta, { headers });
  }

  getActiveDieta(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/active`, { headers });
  }

  activateDieta(dietaId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/${dietaId}/activate`, {}, { headers });
  }

  getDietasByUser(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.baseUrl, { headers });
  }

  deleteDieta(dietaId: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${dietaId}`, { headers });
  }

  getDietaById(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  updateDieta(id: number, dieta: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/${id}`, dieta, { headers });
  }
}
