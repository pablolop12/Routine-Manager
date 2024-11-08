import { Component } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastname: '',
    movil: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    // Check if passwords match
    if (this.user.password !== this.user.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        showConfirmButton: true
      });
      return;
    }

    // Call the register method from AuthService
    this.authService.register(this.user).subscribe(
      response => {
        console.log('Usuario registrado:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `Revisa tu correo electrónico ${this.user.email} para confirmar tu email.`,
          showConfirmButton: false,
          timer: 4000
        });
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 4000); // Redirigir después de 4 segundos
      },
      error => {
        if (error.status === 500) { // Suponiendo que 409 es el código de conflicto cuando email o movil ya está en uso
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo electrónico o el teléfono móvil ya están en uso',
            showConfirmButton: true
          });
        } else {
          console.error('Error en el registro:', error);
        }
      }
    );
  }
}
