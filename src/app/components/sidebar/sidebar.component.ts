import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeguridadService } from 'src/app/services/seguridadService/seguridad.service';
import { AuthorizationService } from 'src/app/services/authorizationService/authorization.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    type: number; // 0->No está logueado, 1->Si está logueado, 2->No importa
    roles?: string[]; // Roles permitidos para acceder a esta ruta
    permission?: string; // Permiso específico requerido
}

export const ROUTES: RouteInfo[] = [
    // Rutas generales - accesibles por todos los roles autenticados
    { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '', type: 2 },
    { path: '/perfil-usuario', title: 'Mi Perfil', icon: 'ni-single-02 text-yellow', class: '', type: 1 },
    
    // Rutas administrativas - solo Admin
    { path: '/tablas', title: 'Tablas', icon: 'ni-bullet-list-67 text-red', class: '', type: 1, roles: ['Admin'] },
    { path: '/iconos', title: 'Iconos', icon: 'ni-planet text-blue', class: '', type: 1, roles: ['Admin'] },
    { path: '/mapas', title: 'Mapas', icon: 'ni-pin-3 text-orange', class: '', type: 1, roles: ['Admin'] },
    
    // Gestión financiera - solo Admin
    { path: '/facturas', title: 'Facturas', icon: 'ni-money-coins text-green', class: '', type: 1, roles: ['Admin'] },
    { path: '/cuotas', title: 'Cuotas', icon: 'ni-credit-card text-purple', class: '', type: 1, roles: ['Admin'] },
    { path: '/polizas', title: 'Pólizas', icon: 'ni-paper text-blue', class: '', type: 1, roles: ['Admin'] },
    { path: '/seguros', title: 'Seguros', icon: 'ni-umbrella-13 text-cyan', class: '', type: 1, roles: ['Admin'] },
    
    // Gestión de usuarios - solo Admin
    { path: '/operario', title: 'Operarios', icon: 'ni-circle-08 text-orange', class: '', type: 1, roles: ['Admin'] },
    { path: '/gobernantes', title: 'Gobernantes', icon: 'ni-crown text-yellow', class: '', type: 1, roles: ['Admin'] },
    
    // Configuración del sistema - solo Admin
    { path: '/departamentos', title: 'Departamentos', icon: 'ni-world-2 text-blue', class: '', type: 1, roles: ['Admin'] },
    { path: '/municipios', title: 'Municipios', icon: 'ni-building text-green', class: '', type: 1, roles: ['Admin'] },
    { path: '/tiposervicio', title: 'Tipos de Servicio', icon: 'ni-settings-gear-65 text-gray', class: '', type: 1, roles: ['Admin'] },
    
    // Gestión operativa - Operario y Admin
    { path: '/maquinas', title: 'Máquinas', icon: 'ni-settings text-primary', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/maquina-combo', title: 'Combo Máquinas', icon: 'ni-layers text-info', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/combos', title: 'Combos', icon: 'ni-box-2 text-purple', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/especialidades', title: 'Especialidades', icon: 'ni-badge text-orange', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/especialidad-operarios', title: 'Especialidad Operarios', icon: 'ni-hat-3 text-blue', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/especialidad-maquinaria', title: 'Especialidad Maquinaria', icon: 'ni-settings-gear-65 text-green', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/mantenimientos', title: 'Mantenimientos', icon: 'ni-support-16 text-red', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/procedimiento-mantenimiento', title: 'Proc. Mantenimiento', icon: 'ni-book-bookmark text-cyan', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/procedimientos', title: 'Procedimientos', icon: 'ni-collection text-purple', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/turnos', title: 'Turnos', icon: 'ni-time-alarm text-orange', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/servicios', title: 'Servicios', icon: 'ni-delivery-fast text-blue', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/evidencias', title: 'Evidencias', icon: 'ni-camera-compact text-yellow', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/gps', title: 'GPS', icon: 'ni-square-pin text-red', class: '', type: 1, roles: ['Admin', 'Operario'] },
    { path: '/novedades', title: 'Novedades', icon: 'ni-notification-70 text-info', class: '', type: 1, roles: ['Admin', 'Operario'] },
    
    // Gestión jurisdiccional - Gobernante y Admin
    { path: '/obras', title: 'Obras', icon: 'ni-building text-success', class: '', type: 1, roles: ['Admin', 'Gobernante'] },
    { path: '/obra-municipio', title: 'Obra-Municipio', icon: 'ni-map-big text-primary', class: '', type: 1, roles: ['Admin', 'Gobernante'] },
    { path: '/gobernante-municipio', title: 'Gob-Municipio', icon: 'ni-user-run text-orange', class: '', type: 1, roles: ['Admin', 'Gobernante'] },
    { path: '/gobernante-departamento', title: 'Gob-Departamento', icon: 'ni-briefcase-24 text-purple', class: '', type: 1, roles: ['Admin', 'Gobernante'] },
    
    // Comunicación - todos los roles autenticados
    { path: '/chats', title: 'Chats', icon: 'ni-chat-round text-green', class: '', type: 1, roles: ['Admin', 'Operario', 'Gobernante'] },
    { path: '/mensajes', title: 'Mensajes', icon: 'ni-email-83 text-blue', class: '', type: 1, roles: ['Admin', 'Operario', 'Gobernante'] },
    
    // Rutas de autenticación - solo para no autenticados
    { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '', type: 0 },
    { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '', type: 0 }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(
    private router: Router,
    private seguridadService: SeguridadService,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit() {
    this.loadMenuItems();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
  private loadMenuItems() {
    // Filtrar los elementos del menú basándose en el estado de sesión y roles
    this.menuItems = ROUTES.filter(menuItem => {
      const isLoggedIn = this.seguridadService.sesionExiste();
      
      // Verificar tipo de acceso (0=no logueado, 1=logueado, 2=no importa)
      const typeAllowed = menuItem.type === 2 || 
                         (menuItem.type === 1 && isLoggedIn) || 
                         (menuItem.type === 0 && !isLoggedIn);
      
      if (!typeAllowed) return false;
      
      // Si el usuario está logueado y la ruta tiene restricciones de rol
      if (isLoggedIn && menuItem.roles) {
        return this.authorizationService.hasAnyRole(menuItem.roles);
      }
      
      // Si el usuario está logueado y la ruta tiene un permiso específico
      if (isLoggedIn && menuItem.permission) {
        return this.authorizationService.hasPermission(menuItem.permission);
      }
      
      return true;
    });
  }

  // Método público para verificar permisos en el template
  public hasPermission(permission: string): boolean {
    return this.authorizationService.hasPermission(permission);
  }

  // Método público para verificar roles en el template
  public hasRole(role: string): boolean {
    return this.authorizationService.hasRole(role);
  }

  // Getter para acceder al servicio de seguridad en el template
  get securityService() {
    return this.seguridadService;
  }
}
