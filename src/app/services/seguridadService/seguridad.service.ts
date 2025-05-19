import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../../models/usuario.model';
import { map, catchError } from 'rxjs/operators';

interface RespuestaLogin {
  token: string;
  user_id: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  private usuarioSubject = new BehaviorSubject<Usuario>(new Usuario);

  constructor(private http: HttpClient) {
    this.verificarSesionActual();
  }

  // Primera fase de login con email y password
  login(email: string, password: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${environment.api_url}/api/public/security/login`, {
      email,
      password
    }).pipe(
      catchError(error => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  // Segunda fase de login con código 2FA
  validateTwoFactor(email: string, password: string, code2FA: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${environment.api_url}/api/public/security/login/2FA`, {
      email,
      password,
      code2FA
    }).pipe(
      map(response => {
        if (response && response.token) {
          this.guardarDatosSesion(response);
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en validateTwoFactor:', error);
        throw error;
      })
    );
  }

  public get usuarioSesionActiva(): Usuario {
    return this.usuarioSubject.value;
  }

  setUsuario(user: Usuario) {
    this.usuarioSubject.next(user);
  }

  getUsuario() {
    return this.usuarioSubject.asObservable();
  }

  guardarDatosSesion(datosSesion: RespuestaLogin) {
    try {
      const data: Usuario = {
        _id: datosSesion.user_id,
        token: datosSesion.token,
      };
      localStorage.setItem('sesion', JSON.stringify(data));
      this.setUsuario(data);
    } catch (error) {
      console.error('Error al guardar datos de sesión:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('sesion');
    this.setUsuario(new Usuario());
  }

  verificarSesionActual() {
    const sesionActual = this.getDatosSesion();
    if (sesionActual) {
      try {
        const datosUsuario = JSON.parse(sesionActual);
        if (datosUsuario && datosUsuario.token) {
          this.setUsuario(datosUsuario);
        }
      } catch (error) {
        console.error('Error al parsear datos de sesión:', error);
        this.logout(); // Limpia la sesión si hay error
      }
    }
  }

  sesionExiste(): boolean {
    let sesionActual = this.getDatosSesion();
    return (sesionActual) ? true : false;
  }

  getDatosSesion() {
    let sesionActual = localStorage.getItem('sesion');
    return sesionActual;
  }
}
