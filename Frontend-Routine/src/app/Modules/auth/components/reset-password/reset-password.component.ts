import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../Services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    if (this.token) {
      this.authService.resetPassword(this.token, this.password).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña restablecida',
            text: 'Tu contraseña ha sido restablecida exitosamente'
          }).then(() => {
            this.router.navigate(['/auth/login']);
          });
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo restablecer la contraseña'
          });
        }
      );
    }
  }
}
