import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../../models/usuario.model';
import { map, catchError } from 'rxjs/operators';

interface RespuestaLogin {
  token?: string;
  user?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
    permissions?: string[];
  };
  message?: string;
  error?: any;
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
    return this.http.post<any>(`${environment.api_url}/api/public/security/login`, {
      email,
      password
    }).pipe(
      map(response => {
        console.log('Respuesta del login:', response);
        // Si la respuesta es un string, intentamos parsearlo
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch (e) {
            console.error('Error parseando respuesta:', e);
            throw new Error('Formato de respuesta inválido');
          }
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  // Segunda fase de login con código 2FA
  validateTwoFactor(email: string, password: string, code2FA: string, userId: string): Observable<RespuestaLogin> {
    return this.http.post<any>(`${environment.api_url}/api/public/security/login/2FA/${userId}`, {
      email,
      password,
      code2FA
    }).pipe(
      map(response => {
        console.log('Respuesta 2FA:', response);
        let parsedResponse: RespuestaLogin;
        
        // Si la respuesta es un string (token), la formateamos
        if (typeof response === 'string') {
          parsedResponse = {
            token: response,
            user: { 
              _id: userId,
              name: email.split('@')[0],
              email: email
            }
          };
        } else {
          parsedResponse = response;
        }

        // Si tenemos un token, guardamos la sesión
        if (parsedResponse.token) {
          this.guardarDatosSesion(parsedResponse);
        }

        return parsedResponse;
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
      if (!datosSesion.token) {
        throw new Error('No se recibió el token de autenticación');
      }      // Decodificar el token para extraer nombre/email si no vienen en la respuesta
      let nombre = datosSesion.user?.name || '';
      let email = datosSesion.user?.email || '';
      let _id = datosSesion.user?._id || '';
      let role = '';
      let permissions = datosSesion.user?.permissions || [];
        // Extraer el rol correctamente - puede ser string u objeto
      if (datosSesion.user?.role) {
        if (typeof datosSesion.user.role === 'string') {
          role = datosSesion.user.role;
        } else if (datosSesion.user.role && (datosSesion.user.role as any).name) {
          role = (datosSesion.user.role as any).name; // Extraer role.name del objeto
        }
      }
        if (datosSesion.token) {
        const payload: any = JSON.parse(atob(datosSesion.token.split('.')[1]));
        if (payload) {
          nombre = nombre || payload.name || payload.sub || '';
          email = email || payload.email || '';
          _id = _id || payload._id || '';
            // Extraer rol del payload del JWT
          if (payload.role && !role) {
            if (typeof payload.role === 'string') {
              role = payload.role;
            } else if (payload.role && (payload.role as any).name) {
              role = (payload.role as any).name; // Extraer role.name del JWT payload
            }
          }
          
          permissions = permissions.length > 0 ? permissions : (payload.permissions || []);
        }
      }
      const usuarioData = new Usuario();
      usuarioData.token = datosSesion.token;
      usuarioData._id = _id;
      usuarioData.email = email;
      usuarioData.nombre = nombre;
      usuarioData.role = role;
      usuarioData.permissions = permissions;
      localStorage.setItem('sesion', JSON.stringify(usuarioData));
      this.setUsuario(usuarioData);
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
