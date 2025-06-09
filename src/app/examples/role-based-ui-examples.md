# Role-Based UI Examples

## Ejemplos de uso del sistema de autorización

### 1. Uso de la directiva *hasPermission

```html
<!-- Mostrar botón solo si el usuario tiene permiso de gestión de usuarios -->
<button *hasPermission="'MANAGE_USERS'" class="btn btn-primary">
  Gestionar Usuarios
</button>

<!-- Mostrar sección financiera solo para administradores -->
<div *hasPermission="'VIEW_FINANCIAL_REPORTS'" class="financial-section">
  <h3>Reportes Financieros</h3>
  <!-- Contenido financiero aquí -->
</div>

<!-- Mostrar múltiples elementos con permisos -->
<div class="admin-panel">
  <button *hasPermission="'CREATE_USERS'" class="btn btn-success">Crear Usuario</button>
  <button *hasPermission="'DELETE_USERS'" class="btn btn-danger">Eliminar Usuario</button>
  <button *hasPermission="'EDIT_USERS'" class="btn btn-warning">Editar Usuario</button>
</div>
```

### 2. Uso del AuthorizationService en componentes

```typescript
export class ExampleComponent implements OnInit {
  constructor(private authService: AuthorizationService) {}

  ngOnInit() {
    // Verificar permisos específicos
    if (this.authService.hasPermission('VIEW_REPORTS')) {
      this.loadReports();
    }

    // Verificar roles específicos
    if (this.authService.hasRole('Admin')) {
      this.loadAdminData();
    }

    // Verificar múltiples roles
    if (this.authService.hasAnyRole(['Admin', 'Operario'])) {
      this.loadOperationalData();
    }
  }

  // Getters para usar en el template
  get canCreateUsers(): boolean {
    return this.authService.hasPermission('CREATE_USERS');
  }

  get isAdminOrGobernante(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Gobernante']);
  }

  get currentRole(): string {
    return this.authService.getCurrentUserRole();
  }
}
```

### 3. Ejemplo de menú condicional

```html
<!-- Navigation menu with role-based items -->
<nav class="navbar">
  <ul class="nav">
    <!-- Visible para todos los usuarios autenticados -->
    <li class="nav-item">
      <a routerLink="/dashboard">Dashboard</a>
    </li>
    
    <!-- Solo para Admin -->
    <li *hasPermission="'MANAGE_USERS'" class="nav-item">
      <a routerLink="/usuarios">Gestión de Usuarios</a>
    </li>
    
    <!-- Solo para Admin y Operario -->
    <li *ngIf="authService.hasAnyRole(['Admin', 'Operario'])" class="nav-item">
      <a routerLink="/maquinas">Máquinas</a>
    </li>
    
    <!-- Solo para Admin y Gobernante -->
    <li *ngIf="authService.hasAnyRole(['Admin', 'Gobernante'])" class="nav-item">
      <a routerLink="/obras">Obras</a>
    </li>
    
    <!-- Menú financiero solo para Admin -->
    <li *hasPermission="'VIEW_FINANCIAL_REPORTS'" class="nav-item dropdown">
      <a class="nav-link dropdown-toggle">Financiero</a>
      <ul class="dropdown-menu">
        <li><a routerLink="/facturas">Facturas</a></li>
        <li><a routerLink="/cuotas">Cuotas</a></li>
        <li><a routerLink="/polizas">Pólizas</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

### 4. Ejemplo de tabla con acciones condicionadas

```html
<table class="table">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Email</th>
      <th>Rol</th>
      <th *hasPermission="'EDIT_USERS'">Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let user of users">
      <td>{{ user.nombre }}</td>
      <td>{{ user.email }}</td>
      <td>{{ user.role }}</td>
      <td *hasPermission="'EDIT_USERS'">
        <button *hasPermission="'EDIT_USERS'" 
                class="btn btn-sm btn-primary" 
                (click)="editUser(user.id)">
          Editar
        </button>
        <button *hasPermission="'DELETE_USERS'" 
                class="btn btn-sm btn-danger ms-2" 
                (click)="deleteUser(user.id)">
          Eliminar
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

### 5. Ejemplo de dashboard con secciones por rol

```html
<div class="dashboard">
  <div class="row">
    <!-- Estadísticas generales - visible para todos -->
    <div class="col-md-4">
      <div class="card">
        <div class="card-body">
          <h5>Total Servicios</h5>
          <h2>{{ totalServices }}</h2>
        </div>
      </div>
    </div>

    <!-- Estadísticas financieras - solo Admin -->
    <div *hasPermission="'VIEW_FINANCIAL_REPORTS'" class="col-md-4">
      <div class="card">
        <div class="card-body">
          <h5>Ingresos Totales</h5>
          <h2>{{ totalRevenue | currency }}</h2>
        </div>
      </div>
    </div>

    <!-- Estadísticas operativas - Admin y Operario -->
    <div *ngIf="authService.hasAnyRole(['Admin', 'Operario'])" class="col-md-4">
      <div class="card">
        <div class="card-body">
          <h5>Máquinas Activas</h5>
          <h2>{{ activeMachines }}</h2>
        </div>
      </div>
    </div>
  </div>

  <!-- Panel de administración - solo Admin -->
  <div *hasPermission="'MANAGE_USERS'" class="row mt-4">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h4>Panel de Administración</h4>
        </div>
        <div class="card-body">
          <button class="btn btn-primary me-2">Gestionar Usuarios</button>
          <button class="btn btn-success me-2">Ver Reportes</button>
          <button class="btn btn-info">Configuración</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Panel operativo - Admin y Operario -->
  <div *ngIf="authService.hasAnyRole(['Admin', 'Operario'])" class="row mt-4">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h4>Panel Operativo</h4>
        </div>
        <div class="card-body">
          <button class="btn btn-primary me-2">Gestionar Máquinas</button>
          <button class="btn btn-warning me-2">Mantenimientos</button>
          <button class="btn btn-info">Servicios</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Panel jurisdiccional - Admin y Gobernante -->
  <div *ngIf="authService.hasAnyRole(['Admin', 'Gobernante'])" class="row mt-4">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h4>Panel Jurisdiccional</h4>
        </div>
        <div class="card-body">
          <button class="btn btn-success me-2">Gestionar Obras</button>
          <button class="btn btn-primary me-2">Municipios</button>
          <button class="btn btn-info">Departamentos</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 6. Ejemplo de formulario con campos condicionados

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <!-- Campos básicos - visibles para todos -->
  <div class="mb-3">
    <label for="nombre" class="form-label">Nombre</label>
    <input type="text" id="nombre" class="form-control" formControlName="nombre">
  </div>

  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" id="email" class="form-control" formControlName="email">
  </div>

  <!-- Campo de rol - solo Admin puede editarlo -->
  <div *hasPermission="'MANAGE_USER_ROLES'" class="mb-3">
    <label for="role" class="form-label">Rol</label>
    <select id="role" class="form-select" formControlName="role">
      <option value="Operario">Operario</option>
      <option value="Gobernante">Gobernante</option>
      <option *hasPermission="'ASSIGN_ADMIN_ROLE'" value="Admin">Admin</option>
    </select>
  </div>

  <!-- Configuraciones avanzadas - solo Admin -->
  <div *hasPermission="'MANAGE_ADVANCED_SETTINGS'" class="mb-3">
    <h5>Configuraciones Avanzadas</h5>
    <div class="form-check">
      <input type="checkbox" id="canCreateUsers" class="form-check-input" formControlName="canCreateUsers">
      <label for="canCreateUsers" class="form-check-label">Puede crear usuarios</label>
    </div>
    <div class="form-check">
      <input type="checkbox" id="canDeleteUsers" class="form-check-input" formControlName="canDeleteUsers">
      <label for="canDeleteUsers" class="form-check-label">Puede eliminar usuarios</label>
    </div>
  </div>

  <div class="d-flex gap-2">
    <button type="submit" class="btn btn-primary">Guardar</button>
    <button *hasPermission="'DELETE_USERS'" 
            type="button" 
            class="btn btn-danger" 
            (click)="deleteUser()">
      Eliminar
    </button>
  </div>
</form>
```

### 7. Uso en componentes TypeScript

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit {
  
  constructor(public authService: AuthorizationService) {}

  ngOnInit() {
    // Cargar datos según el rol del usuario
    this.loadDataBasedOnRole();
  }

  private loadDataBasedOnRole() {
    if (this.authService.hasRole('Admin')) {
      this.loadAllData();
    } else if (this.authService.hasRole('Operario')) {
      this.loadOperationalData();
    } else if (this.authService.hasRole('Gobernante')) {
      this.loadJurisdictionalData();
    }
  }

  // Métodos de acción condicionados por permisos
  onCreateUser() {
    if (this.authService.hasPermission('CREATE_USERS')) {
      // Lógica para crear usuario
    } else {
      this.showAccessDeniedMessage();
    }
  }

  onDeleteUser(userId: string) {
    if (this.authService.hasPermission('DELETE_USERS')) {
      // Lógica para eliminar usuario
    } else {
      this.showAccessDeniedMessage();
    }
  }

  // Getters para usar en el template
  get canManageUsers(): boolean {
    return this.authService.hasPermission('MANAGE_USERS');
  }

  get isOperationalUser(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Operario']);
  }

  get currentUserRole(): string {
    return this.authService.getCurrentUserRole();
  }

  private showAccessDeniedMessage() {
    // Mostrar mensaje de acceso denegado
    alert('No tienes permisos para realizar esta acción');
  }
}
```

## Permisos disponibles por rol

### Admin
- Acceso completo a todas las funcionalidades
- MANAGE_USERS, CREATE_USERS, EDIT_USERS, DELETE_USERS
- VIEW_FINANCIAL_REPORTS, MANAGE_FINANCIAL_DATA
- VIEW_AUDIT_LOGS, SYSTEM_CONFIGURATION
- Todos los permisos de Operario y Gobernante

### Operario
- VIEW_OWN_PROFILE, EDIT_OWN_PROFILE
- MANAGE_SPECIALTIES, VIEW_SPECIALTIES
- VIEW_BASIC_REPORTS
- SEND_MESSAGES, VIEW_MESSAGES
- MANAGE_MACHINES, VIEW_MAINTENANCE

### Gobernante
- VIEW_OWN_PROFILE, EDIT_OWN_PROFILE
- MANAGE_OPERARIOS_IN_JURISDICTION
- MANAGE_POLICIES_IN_JURISDICTION
- VIEW_JURISDICTION_REPORTS
- SEND_MESSAGES, VIEW_MESSAGES
- MANAGE_WORKS_IN_JURISDICTION

## Uso en rutas

Las rutas ya están protegidas con guards, pero también puedes verificar permisos programáticamente:

```typescript
// En un componente o servicio
if (this.authService.hasPermission('VIEW_FINANCIAL_REPORTS')) {
  this.router.navigate(['/facturas']);
} else {
  this.router.navigate(['/dashboard']);
}
```
