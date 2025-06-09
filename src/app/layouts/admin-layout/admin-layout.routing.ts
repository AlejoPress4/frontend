import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

// Guardians para control de acceso
import { RoleGuard } from '../../guardianes/role.guard';
import { AdminGuard } from '../../guardianes/admin.guard';
import { OperarioGuard } from '../../guardianes/operario.guard';
import { GobernanteGuard } from '../../guardianes/gobernante.guard';

export const AdminLayoutRoutes: Routes = [
  // Rutas principales - accesibles por todos los roles autenticados
  { path: 'dashboard', component: DashboardComponent },
  { path: 'perfil-usuario', component: UserProfileComponent },
  
  // Rutas administrativas - solo Admin
  { path: 'tablas', component: TablesComponent, canActivate: [AdminGuard] },
  { path: 'iconos', component: IconsComponent, canActivate: [AdminGuard] },
  { path: 'mapas', component: MapsComponent, canActivate: [AdminGuard] },

  // Módulos de negocio con controles específicos
  
  // Solo Admin - Gestión financiera y facturación
  { path: 'facturas', loadChildren: () => import('src/app/pages/ms-pages/factura/factura.module').then(m => m.FacturaModule), canActivate: [AdminGuard] },
  { path: 'cuotas', loadChildren: () => import('src/app/pages/ms-pages/cuotas/cuotas.module').then(m => m.CuotasModule), canActivate: [AdminGuard] },
  { path: 'polizas', loadChildren: () => import('src/app/pages/ms-pages/poliza/poliza.module').then(m => m.PolizaModule), canActivate: [AdminGuard] },
  { path: 'seguros', loadChildren: () => import('src/app/pages/ms-pages/seguro/seguro.module').then(m => m.SeguroModule), canActivate: [AdminGuard] },
  
  // Solo Admin - Gestión de usuarios y roles
  { path: 'operario', loadChildren: () => import('src/app/pages/ms-pages/operario/operario.module').then(m => m.OperarioModule), canActivate: [AdminGuard] },
  { path: 'gobernantes', loadChildren: () => import('src/app/pages/ms-pages/gobernante/gobernante.module').then(m => m.GobernanteModule), canActivate: [AdminGuard] },
  
  // Solo Admin - Configuración del sistema
  { path: 'departamentos', loadChildren: () => import('src/app/pages/ms-pages/departamentos/departamentos.module').then(m => m.DepartamentosModule), canActivate: [AdminGuard] },
  { path: 'municipios', loadChildren: () => import('src/app/pages/ms-pages/municipios/municipios.module').then(m => m.MunicipiosModule), canActivate: [AdminGuard] },
  { path: 'tiposervicio', loadChildren: () => import('src/app/pages/ms-pages/tiposervicio/tiposervicio.module').then(m => m.TipoServicioModule), canActivate: [AdminGuard] },
  
  // Operario y Admin - Gestión operativa
  { path: 'maquinas', loadChildren: () => import('src/app/pages/ms-pages/maquina/maquina.module').then(m => m.MaquinaModule), canActivate: [OperarioGuard] },
  { path: 'maquina-combo', loadChildren: () => import('src/app/pages/ms-pages/maquinacombo/maquinacombo.module').then(m => m.MaquinaComboModule), canActivate: [OperarioGuard] },
  { path: 'combos', loadChildren: () => import('src/app/pages/ms-pages/combos/combos.module').then(m => m.CombosModule), canActivate: [OperarioGuard] },
  { path: 'especialidades', loadChildren: () => import('src/app/pages/ms-pages/especialidades/especialidades.module').then(m => m.EspecialidadesModule), canActivate: [OperarioGuard] },
  { path: 'especialidad-operarios', loadChildren: () => import('src/app/pages/ms-pages/operarioespecialidad/operarioespecialidad.module').then(m => m.OperarioEspecialidadModule), canActivate: [OperarioGuard] },
  { path: 'especialidad-maquinaria', loadChildren: () => import('src/app/pages/ms-pages/especialidadmaquinaria/especialidadmaquinaria.module').then(m => m.EspecialidadMaquinariaModule), canActivate: [OperarioGuard] },
  { path: 'mantenimientos', loadChildren: () => import('src/app/pages/ms-pages/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule), canActivate: [OperarioGuard] },
  { path: 'procedimiento-mantenimiento', loadChildren: () => import('src/app/pages/ms-pages/procedimientomantenimiento/procedimientomantenimiento.module').then(m => m.ProcedimientoMantenimientoModule), canActivate: [OperarioGuard] },
  { path: 'procedimientos', loadChildren: () => import('src/app/pages/ms-pages/procedimiento/procedimiento.module').then(m => m.ProcedimientoModule), canActivate: [OperarioGuard] },
  { path: 'turnos', loadChildren: () => import('src/app/pages/ms-pages/turno/turno.module').then(m => m.TurnoModule), canActivate: [OperarioGuard] },
  { path: 'servicios', loadChildren: () => import('src/app/pages/ms-pages/servicio/servicio.module').then(m => m.ServicioModule), canActivate: [OperarioGuard] },
  { path: 'evidencias', loadChildren: () => import('src/app/pages/ms-pages/evidencia/evidencia.module').then(m => m.EvidenciaModule), canActivate: [OperarioGuard] },
  { path: 'gps', loadChildren: () => import('src/app/pages/ms-pages/gps/gps.module').then(m => m.GpsModule), canActivate: [OperarioGuard] },
  { path: 'novedades', loadChildren: () => import('src/app/pages/ms-pages/novedad/novedad.module').then(m => m.NovedadModule), canActivate: [OperarioGuard] },
  
  // Gobernante y Admin - Gestión jurisdiccional
  { path: 'obras', loadChildren: () => import('src/app/pages/ms-pages/obra/obra.module').then(m => m.ObraModule), canActivate: [GobernanteGuard] },
  { path: 'obra-municipio', loadChildren: () => import('src/app/pages/ms-pages/obramunicipio/obramunicipio.module').then(m => m.ObraMunicipioModule), canActivate: [GobernanteGuard] },
  { path: 'gobernante-municipio', loadChildren: () => import('src/app/pages/ms-pages/gobernantemunicipio/gobernantemunicipio.module').then(m => m.GobernanteMunicipioModule), canActivate: [GobernanteGuard] },
  { path: 'gobernante-departamento', loadChildren: () => import('src/app/pages/ms-pages/gobernantedepartamento/gobernantedepartamento.module').then(m => m.GobernanteDepartamentoModule), canActivate: [GobernanteGuard] },
  
  // Accesible por Operario, Gobernante y Admin - Comunicación
  { path: 'chats', loadChildren: () => import('src/app/pages/ms-pages/chats/chats.module').then(m => m.ChatsModule), canActivate: [RoleGuard], data: { roles: ['Admin', 'Operario', 'Gobernante'] } },
  { path: 'mensajes', loadChildren: () => import('src/app/pages/ms-pages/mensaje/mensaje.module').then(m => m.MensajeModule), canActivate: [RoleGuard], data: { roles: ['Admin', 'Operario', 'Gobernante'] } }

];
