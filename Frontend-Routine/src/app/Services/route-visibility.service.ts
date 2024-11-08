import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteVisibilityService {
  private _showNavbar = new BehaviorSubject<boolean>(true);
  showNavbar$ = this._showNavbar.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;
      this._showNavbar.next(currentUrl !== '/auth/login' && currentUrl !== '/auth/register');
    });
  }
}
