import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'perfil-usuario', component: UserProfileComponent },
  { path: 'tablas', component: TablesComponent },
  { path: 'iconos', component: IconsComponent },
  { path: 'mapas', component: MapsComponent },

  { path: 'facturas', loadChildren: () => import('src/app/pages/ms-pages/factura/factura-routing.module').then(m => m.FacturaRoutingModule) },
  { path: 'chats', loadChildren: () => import('src/app/pages/ms-pages/chats/chats-routing.module').then(m => m.ChatsRoutingModule) },
  { path: 'maquina-combo', loadChildren: () => import('src/app/pages/ms-pages/maquinacombo/maquinacombo-routing.module').then(m => m.MaquinaComboRoutingModule) },
  { path: 'combos', loadChildren: () => import('src/app/pages/ms-pages/combos/combos-routing.module').then(m => m.CombosRoutingModule) },
  { path: 'obra', loadChildren: () => import('src/app/pages/ms-pages/obra/obra-routing.module').then(m => m.ObraRoutingModule) },
  { path: 'gobernante-departamento', loadChildren: () => import('src/app/pages/ms-pages/gobernantedepartamento/gobernantedepartamento-routing.module').then(m => m.GobernanteDepartamentoRoutingModule) },
  { path: 'evidencia', loadChildren: () => import('src/app/pages/ms-pages/evidencia/evidencia-routing.module').then(m => m.EvidenciaRoutingModule) },
  { path: 'gps', loadChildren: () => import('src/app/pages/ms-pages/gps/gps-routing.module').then(m => m.GpsRoutingModule) },
  { path: 'seguros', loadChildren: () => import('src/app/pages/ms-pages/seguro/seguro-routing.module').then(m => m.SeguroRoutingModule) },
  { path: 'maquina', loadChildren: () => import('src/app/pages/ms-pages/maquina/maquina-routing.module').then(m => m.MaquinaRoutingModule) },
  { path: 'especialidad-maquinaria', loadChildren: () => import('src/app/pages/ms-pages/especialidadmaquinaria/especialidadmaquinaria-routing.module').then(m => m.EspecialidadMaquinariaRoutingModule) },
  { path: 'mantenimiento', loadChildren: () => import('src/app/pages/ms-pages/mantenimiento/mantenimiento-routing.module').then(m => m.MantenimientoRoutingModule) },
  { path: 'procedimiento-mantenimiento', loadChildren: () => import('src/app/pages/ms-pages/procedimientomantenimiento/procedimientomantenimiento-routing.module').then(m => m.ProcedimientoMantenimientoRoutingModule) },
  { path: 'mensajes', loadChildren: () => import('src/app/pages/ms-pages/mensaje/mensaje-routing.module').then(m => m.MensajeRoutingModule) },
  { path: 'obra-municipio', loadChildren: () => import('src/app/pages/ms-pages/obramunicipio/obramunicipio-routing.module').then(m => m.ObraMunicipioRoutingModule) },
  { path: 'gobernante-municipio', loadChildren: () => import('src/app/pages/ms-pages/gobernantemunicipio/gobernantemunicipio-routing.module').then(m => m.GobernanteMunicipioRoutingModule) },
  { path: 'novedades', loadChildren: () => import('src/app/pages/ms-pages/novedad/novedad-routing.module').then(m => m.NovedadRoutingModule) },
  { path: 'operario', loadChildren: () => import('src/app/pages/ms-pages/operario/operario-routing.module').then(m => m.OperarioRoutingModule) },
  { path: 'polizas', loadChildren: () => import('src/app/pages/ms-pages/poliza/poliza-routing.module').then(m => m.PolizaRoutingModule) },
  { path: 'procedimientos', loadChildren: () => import('src/app/pages/ms-pages/procedimiento/procedimiento-routing.module').then(m => m.ProcedimientoRoutingModule) },
  { path: 'cuotas', loadChildren: () => import('src/app/pages/ms-pages/cuotas/cuotas-routing.module').then(m => m.CuotasRoutingModule) },
  { path: 'gobernantes', loadChildren: () => import('src/app/pages/ms-pages/gobernante/gobernante-routing.module').then(m => m.GobernanteRoutingModule) },
  { path: 'servicio', loadChildren: () => import('src/app/pages/ms-pages/servicio/servicio-routing.module').then(m => m.ServicioRoutingModule) },
  { path: 'turnos', loadChildren: () => import('src/app/pages/ms-pages/turno/turno-routing.module').then(m => m.TurnoRoutingModule) },
  { path: 'especialidad-operarios', loadChildren: () => import('src/app/pages/ms-pages/operarioespecialidad/operarioespecialidad-routing.module').then(m => m.OperarioEspecialidadRoutingModule) },
  { path: 'especialidades', loadChildren: () => import('src/app/pages/ms-pages/especialidades/especialidades-routing.module').then(m => m.EspecialidadesRoutingModule) },
  { path: 'tiposervicio', loadChildren: () => import('src/app/pages/ms-pages/tiposervicio/tiposervicio-routing.module').then(m => m.TipoServicioRoutingModule) }
];
