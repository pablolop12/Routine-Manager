import { Component, HostListener, OnInit, Renderer2, ElementRef } from '@angular/core';
import { RouteVisibilityService } from '../../Services/route-visibility.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isNavbarCollapsed = true;
  showNavbar = true;
  isLoggedIn = false;
  user: any = {};

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private routeVisibilityService: RouteVisibilityService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeVisibilityService.showNavbar$.subscribe((show) => {
      this.showNavbar = show;
    });

    this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.user = user;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = this.el.nativeElement.querySelector('.navbarOwn') as HTMLElement;
    if (window.pageYOffset > 72) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  setNextElementMarginTop() {
    const nextElement = this.el.nativeElement.nextElementSibling as HTMLElement;
    if (nextElement) {
      this.renderer.setStyle(nextElement, 'margin-top', '72px');
    }
  }

  logout() {
    Swal.fire({
      title: "¿Te vas?",
      text: "¿Estás seguro de que quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4BB543",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Hasta la próxima!",
          text: "Tu sesión se ha cerrado exitósamente",
          icon: "success"
        });
        this.router.navigate(['/auth/login']);
        this.authService.logout();
      }
    });
  }
}
