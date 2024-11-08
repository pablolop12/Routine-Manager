import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard   {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role === 'ADMIN') {
      return true;
    } 

    Swal.fire({
      title: 'Denegado',
      text: 'No posees permisos suficientes para acceder a esta sección.',
      icon: 'error',
      confirmButtonText: 'OK'
    });

    this.router.navigate(['/']);
    return false;
  }
}
