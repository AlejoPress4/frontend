import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridadService/seguridad.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AutenticadoGuard implements CanActivate {
  router : Router;
  constructor(private seguridadService: SeguridadService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.seguridadService.sesionExiste()) {
      return true
    } else {
      
      return false
    }
    this.router.navigate(['/login']);
  }
}
