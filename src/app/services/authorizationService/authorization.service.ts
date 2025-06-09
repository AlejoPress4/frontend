import { Injectable } from '@angular/core';
import { SeguridadService } from '../seguridadService/seguridad.service';

export interface Permission {
  url: string;
  method: string;
}

export interface RoleConfig {
  name: string;
  permissions: Permission[];
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  // Mapeo de nombres de roles del backend a roles del sistema
  private roleMapping: { [key: string]: string } = {
    // Roles de Admin
    'ListarUsuarios': 'admin',
    'AdminGeneral': 'admin', 
    'Administrador': 'admin',
    'SuperAdmin': 'admin',
    
    // Roles de Operario
    'OperarioSistema': 'operario',
    'Operario': 'operario',
    'OperarioGeneral': 'operario',
    'TecnicoOperario': 'operario',
    
    // Roles de Gobernante  
    'GobernanteGeneral': 'gobernante',
    'Gobernante': 'gobernante',
    'GobernanteDepartamental': 'gobernante',
    'GobernanteMunicipal': 'gobernante',
    'AutoridadLocal': 'gobernante'
  };

  // Definición de permisos por rol usando URL + método HTTP
  private roleConfigurations: RoleConfig[] = [
    {
      name: 'admin',
      description: 'Administrador del sistema',
      permissions: [
        // Gestión completa de usuarios
        { url: '/users', method: 'GET' },
        { url: '/users', method: 'POST' },
        { url: '/users', method: 'PUT' },
        { url: '/users', method: 'DELETE' },
        
        // Gestión completa de operarios
        { url: '/operarios', method: 'GET' },
        { url: '/operarios', method: 'POST' },
        { url: '/operarios', method: 'PUT' },
        { url: '/operarios', method: 'DELETE' },
        
        // Gestión completa de gobernantes
        { url: '/gobernantes', method: 'GET' },
        { url: '/gobernantes', method: 'POST' },
        { url: '/gobernantes', method: 'PUT' },
        { url: '/gobernantes', method: 'DELETE' },
        
        // Gestión del sistema
        { url: '/system/config', method: 'GET' },
        { url: '/system/config', method: 'PUT' },
        { url: '/reports', method: 'GET' },
        { url: '/audit', method: 'GET' },
        
        // Gestión de especialidades
        { url: '/especialidades', method: 'GET' },
        { url: '/especialidades', method: 'POST' },
        { url: '/especialidades', method: 'PUT' },
        { url: '/especialidades', method: 'DELETE' },
        
        // Gestión de pólizas
        { url: '/polizas', method: 'GET' },
        { url: '/polizas', method: 'POST' },
        { url: '/polizas', method: 'PUT' },
        { url: '/polizas', method: 'DELETE' },
        
        // Gestión de mensajes
        { url: '/mensajes', method: 'GET' },
        { url: '/mensajes', method: 'POST' },
        { url: '/mensajes', method: 'PUT' },
        { url: '/mensajes', method: 'DELETE' }
      ]
    },
    {
      name: 'operario',
      description: 'Operario del sistema',
      permissions: [
        // Solo lectura de su propio perfil
        { url: '/profile', method: 'GET' },
        { url: '/profile', method: 'PUT' },
        
        // Gestión limitada de especialidades
        { url: '/especialidades', method: 'GET' },
        { url: '/operario-especialidades', method: 'GET' },
        { url: '/operario-especialidades', method: 'PUT' },
        
        // Ver pólizas relacionadas
        { url: '/polizas', method: 'GET' },
        
        // Gestión básica de mensajes
        { url: '/mensajes', method: 'GET' },
        { url: '/mensajes', method: 'POST' },
        
        // Ver reportes básicos
        { url: '/reports/basic', method: 'GET' }
      ]
    },
    {
      name: 'gobernante',
      description: 'Gobernante (Departamental o Municipal)',
      permissions: [
        // Gestión de su perfil
        { url: '/profile', method: 'GET' },
        { url: '/profile', method: 'PUT' },
        
        // Gestión de operarios en su jurisdicción
        { url: '/operarios', method: 'GET' },
        { url: '/operarios', method: 'PUT' },
        
        // Gestión de gobernantes
        { url: '/gobernantes', method: 'GET' },
        { url: '/gobernante-departamento', method: 'GET' },
        { url: '/gobernante-municipio', method: 'GET' },
        
        // Ver especialidades
        { url: '/especialidades', method: 'GET' },
        
        // Gestión de pólizas en su jurisdicción
        { url: '/polizas', method: 'GET' },
        { url: '/polizas', method: 'POST' },
        { url: '/polizas', method: 'PUT' },
        
        // Gestión completa de mensajes
        { url: '/mensajes', method: 'GET' },
        { url: '/mensajes', method: 'POST' },
        { url: '/mensajes', method: 'PUT' },
        { url: '/mensajes', method: 'DELETE' },
        
        // Reportes de su jurisdicción
        { url: '/reports/jurisdiction', method: 'GET' }
      ]
    }
  ];

  constructor(private seguridadService: SeguridadService) { }

  // Verificar si el usuario actual tiene un permiso específico (método principal)
  hasPermission(url: string, method?: string): boolean {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user || !user.role) {
      console.warn('[AuthorizationService] Usuario no autenticado o sin rol');
      return false;
    }

    const roleConfig = this.getRoleConfiguration(user.role);
    if (!roleConfig) {
      console.warn(`[AuthorizationService] No se encontró configuración para el rol: ${user.role}`);
      return false;
    }

    // Si no se proporciona method, usar 'GET' por defecto
    const methodToCheck = method || 'GET';

    const hasPermission = roleConfig.permissions.some(p => 
      p.url === url && p.method.toUpperCase() === methodToCheck.toUpperCase()
    );

    console.log(`[AuthorizationService] Verificando permiso - URL: ${url}, Method: ${methodToCheck}, Permitido: ${hasPermission}`);
    return hasPermission;
  }

  // Verificar si el usuario tiene uno de varios permisos
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(p => this.hasPermission(p.url, p.method));
  }

  // Verificar si el usuario tiene todos los permisos especificados
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(p => this.hasPermission(p.url, p.method));
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(roleName: string): boolean {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user || !user.role) {
      return false;
    }
    
    const mappedRole = this.roleMapping[user.role] || user.role.toLowerCase();
    return mappedRole.toLowerCase() === roleName.toLowerCase();
  }

  // Verificar si el usuario tiene uno de varios roles
  hasAnyRole(roles: string[]): boolean {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user || !user.role) {
      return false;
    }
    
    const mappedRole = this.roleMapping[user.role] || user.role.toLowerCase();
    return roles.some(role => mappedRole.toLowerCase() === role.toLowerCase());
  }

  // Obtener la configuración de un rol
  getRoleConfiguration(roleName: string): RoleConfig | undefined {
    // Mapear el nombre del rol del backend al rol del sistema
    const mappedRole = this.roleMapping[roleName] || roleName.toLowerCase();
    
    return this.roleConfigurations.find(r => 
      r.name.toLowerCase() === mappedRole.toLowerCase()
    );
  }

  // Obtener todos los permisos del usuario actual
  getCurrentUserPermissions(): Permission[] {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user || !user.role) {
      return [];
    }

    const roleConfig = this.getRoleConfiguration(user.role);
    return roleConfig ? roleConfig.permissions : [];
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user?.role) return false;
    
    const mappedRole = this.roleMapping[user.role] || user.role.toLowerCase();
    return mappedRole === 'admin';
  }

  // Verificar si el usuario es operario
  isOperario(): boolean {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user?.role) return false;
    
    const mappedRole = this.roleMapping[user.role] || user.role.toLowerCase();
    return mappedRole === 'operario';
  }

  // Verificar si el usuario es gobernante
  isGobernante(): boolean {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user?.role) return false;
    
    const mappedRole = this.roleMapping[user.role] || user.role.toLowerCase();
    return mappedRole === 'gobernante';
  }

  // Obtener el rol mapeado del usuario actual
  getCurrentUserRole(): string | undefined {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user?.role) return undefined;
    
    return this.roleMapping[user.role] || user.role.toLowerCase();
  }

  // Obtener el rol original del backend
  getCurrentUserOriginalRole(): string | undefined {
    const user = this.seguridadService.usuarioSesionActiva;
    return user?.role;
  }

  // Debug: obtener información completa del usuario para verificar
  debugUserInfo(): any {
    const user = this.seguridadService.usuarioSesionActiva;
    if (!user) return null;

    const mappedRole = user.role ? (this.roleMapping[user.role] || user.role.toLowerCase()) : 'sin rol';
    const roleConfig = user.role ? this.getRoleConfiguration(user.role) : null;

    return {
      originalRole: user.role,
      mappedRole: mappedRole,
      hasRoleConfig: !!roleConfig,
      permissions: roleConfig?.permissions || [],
      isAdmin: this.isAdmin(),
      isOperario: this.isOperario(),
      isGobernante: this.isGobernante()
    };
  }

  // Debug: verificar un permiso específico con logging detallado
  debugPermissionCheck(url: string, method: string = 'GET'): any {
    const user = this.seguridadService.usuarioSesionActiva;
    const roleConfig = user?.role ? this.getRoleConfiguration(user.role) : null;
    const hasPermission = this.hasPermission(url, method);

    return {
      user: user ? { role: user.role, mappedRole: this.getCurrentUserRole() } : null,
      requested: { url, method },
      roleConfig: roleConfig ? { name: roleConfig.name, permissionCount: roleConfig.permissions.length } : null,
      hasPermission,
      matchingPermissions: roleConfig?.permissions.filter(p => p.url === url) || []
    };
  }
}
