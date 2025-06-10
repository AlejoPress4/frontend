import { Routes } from '@angular/router';
import { AutenticadoGuard } from '../../guardianes/autenticado.guard';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
  // Rutas principales (dashboard accesible para todos, pero con contenido diferente)
  { path: 'dashboard', component: DashboardComponent },
  
  // Rutas protegidas - solo para usuarios autenticados
  { path: 'perfil-usuario', component: UserProfileComponent, canActivate: [AutenticadoGuard] },
  { path: 'tablas', component: TablesComponent, canActivate: [AutenticadoGuard] },
  { path: 'iconos', component: IconsComponent, canActivate: [AutenticadoGuard] },
  { path: 'mapas', component: MapsComponent, canActivate: [AutenticadoGuard] },

  // Módulos lazy loaded - todos protegidos
  { path: 'facturas', loadChildren: () => import('src/app/pages/ms-pages/factura/factura.module').then(m => m.FacturaModule), canActivate: [AutenticadoGuard] },
  { path: 'chats', loadChildren: () => import('src/app/pages/ms-pages/chats/chats.module').then(m => m.ChatsModule), canActivate: [AutenticadoGuard] },
  { path: 'maquina-combo', loadChildren: () => import('src/app/pages/ms-pages/maquinacombo/maquinacombo.module').then(m => m.MaquinaComboModule), canActivate: [AutenticadoGuard] },
  { path: 'combos', loadChildren: () => import('src/app/pages/ms-pages/combos/combos.module').then(m => m.CombosModule), canActivate: [AutenticadoGuard] },
  { path: 'obras', loadChildren: () => import('src/app/pages/ms-pages/obra/obra.module').then(m => m.ObraModule), canActivate: [AutenticadoGuard] },
  { path: 'gobernante-departamento', loadChildren: () => import('src/app/pages/ms-pages/gobernantedepartamento/gobernantedepartamento.module').then(m => m.GobernanteDepartamentoModule), canActivate: [AutenticadoGuard] },
  { path: 'evidencias', loadChildren: () => import('src/app/pages/ms-pages/evidencia/evidencia.module').then(m => m.EvidenciaModule), canActivate: [AutenticadoGuard] },
  { path: 'gps', loadChildren: () => import('src/app/pages/ms-pages/gps/gps.module').then(m => m.GpsModule), canActivate: [AutenticadoGuard] },
  { path: 'seguros', loadChildren: () => import('src/app/pages/ms-pages/seguro/seguro.module').then(m => m.SeguroModule), canActivate: [AutenticadoGuard] },
  { path: 'maquinas', loadChildren: () => import('src/app/pages/ms-pages/maquina/maquina.module').then(m => m.MaquinaModule), canActivate: [AutenticadoGuard] },
  { path: 'especialidad-maquinaria', loadChildren: () => import('src/app/pages/ms-pages/especialidadmaquinaria/especialidadmaquinaria.module').then(m => m.EspecialidadMaquinariaModule), canActivate: [AutenticadoGuard] },
  { path: 'mantenimientos', loadChildren: () => import('src/app/pages/ms-pages/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule), canActivate: [AutenticadoGuard] },
  { path: 'procedimiento-mantenimiento', loadChildren: () => import('src/app/pages/ms-pages/procedimientomantenimiento/procedimientomantenimiento.module').then(m => m.ProcedimientoMantenimientoModule), canActivate: [AutenticadoGuard] },
  { path: 'mensajes', loadChildren: () => import('src/app/pages/ms-pages/mensaje/mensaje.module').then(m => m.MensajeModule), canActivate: [AutenticadoGuard] },
  { path: 'obra-municipio', loadChildren: () => import('src/app/pages/ms-pages/obramunicipio/obramunicipio.module').then(m => m.ObraMunicipioModule), canActivate: [AutenticadoGuard] },
  { path: 'gobernante-municipio', loadChildren: () => import('src/app/pages/ms-pages/gobernantemunicipio/gobernantemunicipio.module').then(m => m.GobernanteMunicipioModule), canActivate: [AutenticadoGuard] },
  { path: 'novedades', loadChildren: () => import('src/app/pages/ms-pages/novedad/novedad.module').then(m => m.NovedadModule), canActivate: [AutenticadoGuard] },
  { path: 'operario', loadChildren: () => import('src/app/pages/ms-pages/operario/operario.module').then(m => m.OperarioModule), canActivate: [AutenticadoGuard] },
  { path: 'polizas', loadChildren: () => import('src/app/pages/ms-pages/poliza/poliza.module').then(m => m.PolizaModule), canActivate: [AutenticadoGuard] },
  { path: 'procedimientos', loadChildren: () => import('src/app/pages/ms-pages/procedimiento/procedimiento.module').then(m => m.ProcedimientoModule), canActivate: [AutenticadoGuard] },
  { path: 'cuotas', loadChildren: () => import('src/app/pages/ms-pages/cuotas/cuotas.module').then(m => m.CuotasModule), canActivate: [AutenticadoGuard] },
  { path: 'gobernantes', loadChildren: () => import('src/app/pages/ms-pages/gobernante/gobernante.module').then(m => m.GobernanteModule), canActivate: [AutenticadoGuard] },
  { path: 'servicios', loadChildren: () => import('src/app/pages/ms-pages/servicio/servicio.module').then(m => m.ServicioModule), canActivate: [AutenticadoGuard] },  
  { path: 'turnos', loadChildren: () => import('src/app/pages/ms-pages/turno/turno.module').then(m => m.TurnoModule), canActivate: [AutenticadoGuard] },
  { path: 'especialidad-operarios', loadChildren: () => import('src/app/pages/ms-pages/operarioespecialidad/operarioespecialidad.module').then(m => m.OperarioEspecialidadModule), canActivate: [AutenticadoGuard] },
  { path: 'especialidades', loadChildren: () => import('src/app/pages/ms-pages/especialidades/especialidades.module').then(m => m.EspecialidadesModule), canActivate: [AutenticadoGuard] },
  { path: 'tiposervicio', loadChildren: () => import('src/app/pages/ms-pages/tiposervicio/tiposervicio.module').then(m => m.TipoServicioModule), canActivate: [AutenticadoGuard] },
  { path: 'departamentos', loadChildren: () => import('src/app/pages/ms-pages/departamentos/departamentos.module').then(m => m.DepartamentosModule), canActivate: [AutenticadoGuard] },
  { path: 'municipios', loadChildren: () => import('src/app/pages/ms-pages/municipios/municipios.module').then(m => m.MunicipiosModule), canActivate: [AutenticadoGuard] }
];
