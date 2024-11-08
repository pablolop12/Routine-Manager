import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard   {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = !!this.authService.currentUserValue;
    if (isLoggedIn) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'No puedes acceder a esta ruta teniendo una sesión activa',
        showConfirmButton: false,
        timer: 4000
      })
      this.router.navigate(['/']);
      return false;
      
    }
    return true;
  }
}
