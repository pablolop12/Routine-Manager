import { Component } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(response => {
      console.log('User logged in successfully:', response);
      localStorage.setItem('token', response.token);
    }, error => {
      console.error('Login error:', error);
    });
  }

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Login successful', response);
        Swal.fire({
          icon: 'success',
          title: '¡Hola!',
          text: 'Has iniciado sesión correctamente',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error => {
        console.error('Login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Parece ser que el correo electrónico o la contraseña introducidos no son correctos',
          customClass: {
            confirmButton: 'btn btn-warning'
          },
          buttonsStyling: false
        });
      }
    );
  }

  forgot(): void {
    Swal.fire({
      title: "Contraseña olvidada",
      text: "Introduce el correo electrónico asociado a tu cuenta para reestablecer tu contraseña, te enviaremos un email de reseteo.",
      input: "email",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        return this.authService.forgotPassword(email).toPromise().then(
          response => {
            if (!response.success) {
              throw new Error(response.message);
            }
            return response;
          },
          error => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Correo enviado',
          text: 'Revisa tu bandeja de entrada para reestablecer tu contraseña',
          icon: 'success'
        });
      }
    });
  }
}
