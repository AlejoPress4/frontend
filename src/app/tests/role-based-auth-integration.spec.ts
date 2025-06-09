import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/authorizationService/authorization.service';
import { SeguridadService } from '../services/seguridadService/seguridad.service';
import { AdminGuard } from '../guardianes/admin.guard';
import { OperarioGuard } from '../guardianes/operario.guard';
import { GobernanteGuard } from '../guardianes/gobernante.guard';
import { RoleGuard } from '../guardianes/role.guard';
import { Usuario } from '../models/usuario.model';

describe('Role-Based Authentication System Integration Tests', () => {
  let authService: AuthorizationService;
  let securityService: SeguridadService;
  let router: Router;
  let adminGuard: AdminGuard;
  let operarioGuard: OperarioGuard;
  let gobernanteGuard: GobernanteGuard;
  let roleGuard: RoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationService,
        SeguridadService,
        AdminGuard,
        OperarioGuard,
        GobernanteGuard,
        RoleGuard,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });

    authService = TestBed.inject(AuthorizationService);
    securityService = TestBed.inject(SeguridadService);
    router = TestBed.inject(Router);
    adminGuard = TestBed.inject(AdminGuard);
    operarioGuard = TestBed.inject(OperarioGuard);
    gobernanteGuard = TestBed.inject(GobernanteGuard);
    roleGuard = TestBed.inject(RoleGuard);
  });

  describe('Admin Role Tests', () => {
    beforeEach(() => {
      const adminUser = new Usuario();
      adminUser.role = 'Admin';
      adminUser.permissions = authService.getRolePermissions('Admin');
      spyOn(securityService, 'existSession').and.returnValue(true);
      spyOn(securityService, 'getUsuario').and.returnValue(of(adminUser));
    });

    it('should allow Admin access to all guards', async () => {
      const route = { data: {} } as any;
      const state = {} as any;

      expect(await adminGuard.canActivate(route, state)).toBe(true);
      expect(await operarioGuard.canActivate(route, state)).toBe(true);
      expect(await gobernanteGuard.canActivate(route, state)).toBe(true);
    });

    it('should have all permissions for Admin', () => {
      expect(authService.hasPermission('MANAGE_USERS')).toBe(true);
      expect(authService.hasPermission('VIEW_FINANCIAL_REPORTS')).toBe(true);
      expect(authService.hasPermission('SYSTEM_CONFIGURATION')).toBe(true);
      expect(authService.hasPermission('VIEW_AUDIT_LOGS')).toBe(true);
    });
  });

  describe('Operario Role Tests', () => {
    beforeEach(() => {
      const operarioUser = new Usuario();
      operarioUser.role = 'Operario';
      operarioUser.permissions = authService.getRolePermissions('Operario');
      spyOn(securityService, 'existSession').and.returnValue(true);
      spyOn(securityService, 'getUsuario').and.returnValue(of(operarioUser));
    });

    it('should allow Operario access to operario routes but not admin routes', async () => {
      const route = { data: {} } as any;
      const state = {} as any;

      expect(await adminGuard.canActivate(route, state)).toBe(false);
      expect(await operarioGuard.canActivate(route, state)).toBe(true);
      expect(await gobernanteGuard.canActivate(route, state)).toBe(false);
    });

    it('should have limited permissions for Operario', () => {
      expect(authService.hasPermission('VIEW_OWN_PROFILE')).toBe(true);
      expect(authService.hasPermission('MANAGE_SPECIALTIES')).toBe(true);
      expect(authService.hasPermission('VIEW_BASIC_REPORTS')).toBe(true);
      expect(authService.hasPermission('MANAGE_USERS')).toBe(false);
      expect(authService.hasPermission('VIEW_FINANCIAL_REPORTS')).toBe(false);
    });
  });

  describe('Gobernante Role Tests', () => {
    beforeEach(() => {
      const gobernanteUser = new Usuario();
      gobernanteUser.role = 'Gobernante';
      gobernanteUser.permissions = authService.getRolePermissions('Gobernante');
      spyOn(securityService, 'existSession').and.returnValue(true);
      spyOn(securityService, 'getUsuario').and.returnValue(of(gobernanteUser));
    });

    it('should allow Gobernante access to gobernante routes but not admin/operario routes', async () => {
      const route = { data: {} } as any;
      const state = {} as any;

      expect(await adminGuard.canActivate(route, state)).toBe(false);
      expect(await operarioGuard.canActivate(route, state)).toBe(false);
      expect(await gobernanteGuard.canActivate(route, state)).toBe(true);
    });

    it('should have jurisdiction-based permissions for Gobernante', () => {
      expect(authService.hasPermission('VIEW_OWN_PROFILE')).toBe(true);
      expect(authService.hasPermission('MANAGE_OPERARIOS_IN_JURISDICTION')).toBe(true);
      expect(authService.hasPermission('MANAGE_POLICIES_IN_JURISDICTION')).toBe(true);
      expect(authService.hasPermission('VIEW_JURISDICTION_REPORTS')).toBe(true);
      expect(authService.hasPermission('MANAGE_USERS')).toBe(false);
      expect(authService.hasPermission('MANAGE_SPECIALTIES')).toBe(false);
    });
  });

  describe('RoleGuard with Multiple Roles', () => {
    it('should allow access when user has one of the required roles', async () => {
      const operarioUser = new Usuario();
      operarioUser.role = 'Operario';
      operarioUser.permissions = authService.getRolePermissions('Operario');
      spyOn(securityService, 'existSession').and.returnValue(true);
      spyOn(securityService, 'getUsuario').and.returnValue(of(operarioUser));

      const route = { 
        data: { roles: ['Admin', 'Operario', 'Gobernante'] } 
      } as any;
      const state = {} as any;

      expect(await roleGuard.canActivate(route, state)).toBe(true);
    });

    it('should deny access when user does not have any of the required roles', async () => {
      const operarioUser = new Usuario();
      operarioUser.role = 'Operario';
      operarioUser.permissions = authService.getRolePermissions('Operario');
      spyOn(securityService, 'existSession').and.returnValue(true);
      spyOn(securityService, 'getUsuario').and.returnValue(of(operarioUser));

      const route = { 
        data: { roles: ['Admin'] } 
      } as any;
      const state = {} as any;

      expect(await roleGuard.canActivate(route, state)).toBe(false);
    });
  });

  describe('Unauthorized Access Tests', () => {
    beforeEach(() => {
      spyOn(securityService, 'existSession').and.returnValue(false);
    });

    it('should deny access to all guards when not authenticated', async () => {
      const route = { data: {} } as any;
      const state = {} as any;

      expect(await adminGuard.canActivate(route, state)).toBe(false);
      expect(await operarioGuard.canActivate(route, state)).toBe(false);
      expect(await gobernanteGuard.canActivate(route, state)).toBe(false);
      expect(await roleGuard.canActivate(route, state)).toBe(false);
    });
  });

  describe('Permission Hierarchy Tests', () => {
    it('should respect permission hierarchy (Admin > Gobernante, Admin > Operario)', () => {
      const adminPermissions = authService.getRolePermissions('Admin');
      const operarioPermissions = authService.getRolePermissions('Operario');
      const gobernantePermissions = authService.getRolePermissions('Gobernante');

      // Admin should have more permissions than other roles
      expect(adminPermissions.length).toBeGreaterThan(operarioPermissions.length);
      expect(adminPermissions.length).toBeGreaterThan(gobernantePermissions.length);

      // Admin should have all basic permissions that others have
      const basicPermissions = ['VIEW_OWN_PROFILE', 'EDIT_OWN_PROFILE', 'SEND_MESSAGES', 'VIEW_MESSAGES'];
      basicPermissions.forEach(permission => {
        expect(adminPermissions).toContain(permission);
        expect(operarioPermissions).toContain(permission);
        expect(gobernantePermissions).toContain(permission);
      });
    });
  });

  describe('Route Protection Integration', () => {
    it('should protect financial routes for non-admin users', () => {
      const operarioUser = new Usuario();
      operarioUser.role = 'Operario';
      operarioUser.permissions = authService.getRolePermissions('Operario');
      
      spyOn(securityService, 'existSession').and.returnValue(true);
      spyOn(securityService, 'getUsuario').and.returnValue(of(operarioUser));

      // These routes should be protected for Operario
      expect(authService.hasPermission('VIEW_FINANCIAL_REPORTS')).toBe(false);
      expect(authService.hasPermission('MANAGE_USERS')).toBe(false);
      expect(authService.hasPermission('SYSTEM_CONFIGURATION')).toBe(false);
    });

    it('should allow operational routes for operario users', () => {
      const operarioUser = new Usuario();
      operarioUser.role = 'Operario';
      operarioUser.permissions = authService.getRolePermissions('Operario');
      
      spyOn(securityService, 'existSession').and.returnValue(true);
      spyOn(securityService, 'getUsuario').and.returnValue(of(operarioUser));

      // These routes should be accessible for Operario
      expect(authService.hasPermission('MANAGE_SPECIALTIES')).toBe(true);
      expect(authService.hasPermission('VIEW_BASIC_REPORTS')).toBe(true);
      expect(authService.hasPermission('SEND_MESSAGES')).toBe(true);
    });
  });
});
