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
        next: (response) => {
          this.showTwoFactorInput = true;
          this.loginForm.get('code2FA')?.setValidators([Validators.required]);
          this.loginForm.get('code2FA')?.updateValueAndValidity();
          
          Swal.fire({
            title: 'Código 2FA',
            text: 'Se ha enviado un código a su email. Por favor, ingréselo para continuar.',
            icon: 'info'
          });
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
      this.seguridadService.validateTwoFactor(this.attemptedEmail, this.attemptedPassword, code2FA).subscribe({
        next: (response) => {
          if (response) {
            Swal.fire({
              title: '¡Bienvenido!',
              text: 'Ha iniciado sesión exitosamente',
              icon: 'success',
              timer: 1500
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          }
        },
        error: (error) => {
          Swal.fire({
            title: 'Error de autenticación',
            text: error.error?.message || 'Código 2FA inválido',
            icon: 'error'
          });
        }
      });
    }
  }
}