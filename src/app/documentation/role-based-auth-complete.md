# Role-Based Authentication System - Complete Implementation

## Sistema Completo de Autenticación por Roles

Este documento describe la implementación completa del sistema de autenticación basado en roles para la aplicación Angular, integrándose con el backend ms-security.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **Guards (Guardianes)**
   - `AutenticadoGuard` - Verificación de autenticación básica
   - `AdminGuard` - Acceso exclusivo para administradores
   - `OperarioGuard` - Acceso para operarios y administradores
   - `GobernanteGuard` - Acceso para gobernantes y administradores
   - `RoleGuard` - Guard genérico configurable por datos de ruta

2. **Services (Servicios)**
   - `AuthorizationService` - Gestión de permisos y roles
   - `SeguridadService` - Autenticación y gestión de sesión (mejorado)

3. **Models (Modelos)**
   - `Usuario` - Modelo extendido con propiedades de rol y permisos

4. **Directives (Directivas)**
   - `HasPermissionDirective` - Control de visibilidad en templates

## 🔐 Roles y Permisos

### Admin (Administrador)
**Permisos completos del sistema:**
- `MANAGE_USERS`, `CREATE_USERS`, `EDIT_USERS`, `DELETE_USERS`
- `VIEW_FINANCIAL_REPORTS`, `MANAGE_FINANCIAL_DATA`
- `VIEW_AUDIT_LOGS`, `SYSTEM_CONFIGURATION`
- `MANAGE_USER_ROLES`, `ASSIGN_ADMIN_ROLE`
- `MANAGE_ADVANCED_SETTINGS`
- Todos los permisos de Operario y Gobernante

**Acceso a módulos:**
- Gestión financiera (facturas, cuotas, pólizas, seguros)
- Gestión de usuarios (operarios, gobernantes)
- Configuración del sistema (departamentos, municipios, tipos de servicio)
- Todos los módulos operativos y jurisdiccionales

### Operario
**Permisos operativos:**
- `VIEW_OWN_PROFILE`, `EDIT_OWN_PROFILE`
- `MANAGE_SPECIALTIES`, `VIEW_SPECIALTIES`
- `VIEW_BASIC_REPORTS`
- `SEND_MESSAGES`, `VIEW_MESSAGES`
- `MANAGE_MACHINES`, `VIEW_MAINTENANCE`

**Acceso a módulos:**
- Gestión de máquinas y equipos
- Especialidades y procedimientos
- Mantenimientos y turnos
- Servicios y evidencias
- GPS y novedades
- Comunicación (chats y mensajes)

### Gobernante
**Permisos jurisdiccionales:**
- `VIEW_OWN_PROFILE`, `EDIT_OWN_PROFILE`
- `MANAGE_OPERARIOS_IN_JURISDICTION`
- `MANAGE_POLICIES_IN_JURISDICTION`
- `VIEW_JURISDICTION_REPORTS`
- `SEND_MESSAGES`, `VIEW_MESSAGES`
- `MANAGE_WORKS_IN_JURISDICTION`

**Acceso a módulos:**
- Gestión de obras
- Relaciones obra-municipio
- Gestión gobernante-municipio/departamento
- Comunicación (chats y mensajes)

## 🛣️ Protección de Rutas

### Configuración en `admin-layout.routing.ts`

```typescript
export const AdminLayoutRoutes: Routes = [
  // Rutas generales
  { path: 'dashboard', component: DashboardComponent },
  { path: 'perfil-usuario', component: UserProfileComponent },
  
  // Solo Admin
  { path: 'facturas', ..., canActivate: [AdminGuard] },
  { path: 'operario', ..., canActivate: [AdminGuard] },
  { path: 'departamentos', ..., canActivate: [AdminGuard] },
  
  // Operario y Admin
  { path: 'maquinas', ..., canActivate: [OperarioGuard] },
  { path: 'especialidades', ..., canActivate: [OperarioGuard] },
  
  // Gobernante y Admin
  { path: 'obras', ..., canActivate: [GobernanteGuard] },
  { path: 'obra-municipio', ..., canActivate: [GobernanteGuard] },
  
  // Múltiples roles
  { path: 'chats', ..., canActivate: [RoleGuard], 
    data: { roles: ['Admin', 'Operario', 'Gobernante'] } }
];
```

## 🎨 Implementación en UI

### Menú de Navegación Dinámico

El sidebar se actualiza automáticamente basándose en los roles del usuario:

```typescript
// sidebar.component.ts
private loadMenuItems() {
  this.menuItems = ROUTES.filter(menuItem => {
    const isLoggedIn = this.seguridadService.existSession();
    const typeAllowed = /* lógica de tipo */;
    
    if (isLoggedIn && menuItem.roles) {
      return this.authorizationService.hasAnyRole(menuItem.roles);
    }
    
    return typeAllowed;
  });
}
```

### Directiva de Permisos

```html
<!-- Mostrar solo si tiene permiso -->
<button *hasPermission="'MANAGE_USERS'">Gestionar Usuarios</button>

<!-- Ocultar sección completa -->
<div *hasPermission="'VIEW_FINANCIAL_REPORTS'">
  <!-- Contenido financiero -->
</div>
```

### Verificación Programática

```typescript
// En cualquier componente
constructor(private authService: AuthorizationService) {}

ngOnInit() {
  if (this.authService.hasPermission('VIEW_REPORTS')) {
    this.loadReports();
  }
}

get canCreateUsers(): boolean {
  return this.authService.hasPermission('CREATE_USERS');
}
```

## 🔧 Configuración e Instalación

### 1. Archivos Creados/Modificados

**Nuevos archivos:**
- `src/app/guardianes/role.guard.ts`
- `src/app/guardianes/admin.guard.ts`
- `src/app/guardianes/operario.guard.ts`
- `src/app/guardianes/gobernante.guard.ts`
- `src/app/services/authorizationService/authorization.service.ts`
- `src/app/directives/has-permission.directive.ts`

**Archivos modificados:**
- `src/app/models/usuario.model.ts`
- `src/app/guardianes/autenticado.guard.ts`
- `src/app/services/seguridadService/seguridad.service.ts`
- `src/app/layouts/admin-layout/admin-layout.routing.ts`
- `src/app/components/sidebar/sidebar.component.ts`
- `src/app/components/components.module.ts`
- `src/app/app.module.ts`

### 2. Dependencias

```typescript
// app.module.ts - Providers agregados
providers: [
  // ... existentes
  AutenticadoGuard,
  AdminGuard,
  OperarioGuard,
  GobernanteGuard,
  RoleGuard
]
```

### 3. Integración con JWT

El sistema extrae automáticamente roles y permisos del token JWT:

```typescript
// seguridad.service.ts
guardarDatosSesion(datos: any) {
  // ... código existente
  
  // Extraer role y permissions del token
  if (datos.token) {
    const tokenPayload = this.decodeJWTToken(datos.token);
    usuario.role = tokenPayload.role || 'Guest';
    usuario.permissions = tokenPayload.permissions || [];
  }
}
```

## 🧪 Testing

### Casos de Prueba Cubiertos

1. **Verificación de Guards**
   - Admin accede a todas las rutas
   - Operario accede solo a rutas operativas
   - Gobernante accede solo a rutas jurisdiccionales
   - Usuarios no autenticados son rechazados

2. **Verificación de Permisos**
   - Cada rol tiene los permisos correctos
   - Jerarquía de permisos respetada
   - Permisos específicos funcionan correctamente

3. **Integración UI**
   - Menús se filtran por rol
   - Directivas ocultan/muestran elementos correctamente
   - Verificación programática funciona

### Ejecución de Tests

```bash
ng test --include="**/role-based-auth-integration.spec.ts"
```

## 📱 Ejemplos de Uso

### Dashboard Condicional

```html
<div class="dashboard">
  <!-- Estadísticas generales - todos -->
  <div class="stats-general">...</div>
  
  <!-- Panel financiero - solo Admin -->
  <div *hasPermission="'VIEW_FINANCIAL_REPORTS'">
    <h3>Reportes Financieros</h3>
    <!-- Contenido financiero -->
  </div>
  
  <!-- Panel operativo - Admin y Operario -->
  <div *ngIf="authService.hasAnyRole(['Admin', 'Operario'])">
    <h3>Panel Operativo</h3>
    <!-- Contenido operativo -->
  </div>
  
  <!-- Panel jurisdiccional - Admin y Gobernante -->
  <div *ngIf="authService.hasAnyRole(['Admin', 'Gobernante'])">
    <h3>Panel Jurisdiccional</h3>
    <!-- Contenido jurisdiccional -->
  </div>
</div>
```

### Tabla con Acciones Condicionadas

```html
<table class="table">
  <thead>
    <tr>
      <th>Usuario</th>
      <th>Rol</th>
      <th *hasPermission="'EDIT_USERS'">Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let user of users">
      <td>{{ user.nombre }}</td>
      <td>{{ user.role }}</td>
      <td *hasPermission="'EDIT_USERS'">
        <button *hasPermission="'EDIT_USERS'" 
                (click)="editUser(user)">Editar</button>
        <button *hasPermission="'DELETE_USERS'" 
                (click)="deleteUser(user)">Eliminar</button>
      </td>
    </tr>
  </tbody>
</table>
```

## 🚀 Características Avanzadas

### 1. Mensajes de Acceso Denegado
Los guards muestran automáticamente mensajes SweetAlert2 cuando se deniega el acceso.

### 2. Navegación Automática
Los usuarios son redirigidos automáticamente al dashboard cuando no tienen permisos.

### 3. Actualización en Tiempo Real
Los permisos se actualizan automáticamente cuando cambia la sesión del usuario.

### 4. Flexibilidad de Configuración
El sistema permite agregar nuevos roles y permisos fácilmente modificando `AuthorizationService`.

### 5. Integración Completa
Funciona seamlessly con el sistema de routing, navegación y componentes existentes.

## 🔄 Flujo de Autenticación

1. **Login** → JWT token recibido del backend
2. **Parsing** → Role y permissions extraídos del token
3. **Storage** → Usuario completo guardado en localStorage
4. **Guards** → Verifican permisos en cada navegación
5. **UI** → Se actualiza dinámicamente basándose en roles
6. **Logout** → Limpieza completa de sesión y redirección

## 📞 Soporte y Mantenimiento

### Agregar Nuevo Rol

1. Agregar rol en `AuthorizationService.getRolePermissions()`
2. Crear guard específico si es necesario
3. Actualizar rutas en `admin-layout.routing.ts`
4. Actualizar menú en `sidebar.component.ts`

### Agregar Nuevo Permiso

1. Definir permiso en `AuthorizationService`
2. Asignar a roles apropiados
3. Usar en directivas o verificaciones programáticas

### Debugging

- Verificar token JWT en localStorage
- Usar `authService.getCurrentUserRole()` para debugging
- Revisar console.log en guards para troubleshooting

## ✅ Estado de Implementación

**COMPLETADO:**
- ✅ Sistema de guards completo
- ✅ Servicio de autorización
- ✅ Modelo de usuario extendido
- ✅ Directiva de permisos
- ✅ Protección de rutas
- ✅ Menú dinámico
- ✅ Integración con JWT
- ✅ Documentación y ejemplos
- ✅ Tests de integración

**LISTO PARA PRODUCCIÓN:** 🚀

El sistema está completamente funcional y listo para ser utilizado en la aplicación Angular con el backend ms-security.
