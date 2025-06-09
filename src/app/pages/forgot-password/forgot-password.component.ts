import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  email = '';
  code = '';
  newPassword = '';
  codeSent = false;
  userId = '';
  captchaToken: string = '';
  @ViewChild('recaptchaRef') recaptchaRef: any;

  constructor(private http: HttpClient, private router: Router) {}

  onCaptchaResolved(token: string) {
    this.captchaToken = token;
  }

  requestCode() {
    if (!this.captchaToken) {
      Swal.fire('Completa el reCAPTCHA', 'Por favor, verifica que no eres un robot.', 'warning');
      return;
    }
    this.http.post(`${environment.api_url}/api/public/security/resetpassword/email`, {
      email: this.email,
      captchaToken: this.captchaToken
    }, { responseType: 'text' }).subscribe({
      next: () => {
        this.codeSent = true;
        Swal.fire('Código enviado', 'Revisa tu correo electrónico', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo enviar el código. Verifica el email.', 'error');
      }
    });
  }

  resetPassword() {
    console.log('Email:', this.email, 'Código:', this.code, 'Password:', this.newPassword);
    const body = { email: this.email, password: this.newPassword };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post(`${environment.api_url}/api/public/security/resetpassword/email/${this.code}`, body, { headers, responseType: 'text' }).subscribe({
      next: () => {
        Swal.fire('Contraseña cambiada', 'Ya puedes iniciar sesión con tu nueva contraseña', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('Password reset error:', err);
        Swal.fire('Error', 'No se pudo cambiar la contraseña. Verifica el código.', 'error');
      }
    });
  }
}