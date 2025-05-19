import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeguridadService } from 'src/app/services/seguridadService/seguridad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showTwoFactorInput: boolean = false;
  attemptedEmail: string = '';
  attemptedPassword: string = '';
  attempted_id: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private seguridadService: SeguridadService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      code2FA: ['']
    });
  }

  ngOnInit() {
    if (this.seguridadService.sesionExiste()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, code2FA } = this.loginForm.value;

    if (!this.showTwoFactorInput) {
      // Primera fase del login
      this.attemptedEmail = email;
      this.attemptedPassword = password;
      
      this.seguridadService.login(email, password).subscribe({
        next: (response: any) => {
          console.log('Respuesta completa:', response);
          if (response && response.user && response.user._id) {
            // Primera fase exitosa, necesitamos 2FA
            this.showTwoFactorInput = true;
            this.attempted_id = response.user._id;
            this.loginForm.get('code2FA')?.setValidators([Validators.required]);
            this.loginForm.get('code2FA')?.updateValueAndValidity();
            
            Swal.fire({
              title: 'Código 2FA',
              text: 'Se ha enviado un código a su email. Por favor, ingréselo para continuar.',
              icon: 'info'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'No se recibió el ID de usuario necesario para la autenticación',
              icon: 'error'
            });
          }
        },
        error: (error) => {
          console.error('Error during login:', error);
          Swal.fire({
            title: 'Error de autenticación',
            text: error.error?.message || 'Credenciales inválidas',
            icon: 'error'
          });
        }
      });
    } else {
      // Segunda fase del login (2FA)
      if (!this.attempted_id) {
        Swal.fire({
          title: 'Error',
          text: 'No se encontró el ID de usuario. Por favor, intente iniciar sesión nuevamente.',
          icon: 'error'
        });
        return;
      }

      this.seguridadService.validateTwoFactor(
        this.attemptedEmail,
        this.attemptedPassword,
        code2FA,
        this.attempted_id
      ).subscribe({
        next: (response: any) => {
          console.log('Respuesta 2FA:', response);
          
          // Si la respuesta es un string, es el token
          const token = typeof response === 'string' ? response : response?.token;
          
          if (token) {
            Swal.fire({
              icon: 'success',
              title: '¡Bienvenido!',
              text: 'Inicio de sesión exitoso',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error de autenticación',
              text: 'Código 2FA inválido',
              showConfirmButton: true
            });
          }
        },
        error: (error) => {
          console.error('Error en validación 2FA:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: error.error?.message || 'Error al validar el código 2FA',
            showConfirmButton: true
          });
        }
      });
    }
  }
}