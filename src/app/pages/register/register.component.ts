import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { nombre, email, password } = this.registerForm.value;
    const body = { nombre, email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Enviando registro:', body);
    this.http.post(`${environment.api_url}/api/users`, body, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Respuesta registro:', response);
        Swal.fire('Usuario creado', '¡Ahora puedes iniciar sesión!', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('Error en registro:', err);
        Swal.fire('Error', err.error?.message || 'No se pudo crear el usuario', 'error');
        this.loading = false;
      }
    });
  }
}
