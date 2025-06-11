import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { SeguridadService } from "src/app/services/seguridadService/seguridad.service"
import { Usuario } from "src/app/models/usuario.model"
import { MaquinaService } from "src/app/services/maquinaService/maquina.service"
import { OperarioService } from "src/app/services/operarioService/operario.service"
import { ServicioService } from "src/app/services/servicioService/servicio.service"
import { ObraService } from "src/app/services/obraService/obra.service"
import { GPSService } from "src/app/services/gpsService/gps.service"
import { EvidenciaService } from "src/app/services/evidenciaService/evidencia.service"
import { MantenimientoService } from "src/app/services/mantenimientoService/mantenimiento.service"
import { CuotasService } from "src/app/services/cuotasService/cuotas.service"
import { forkJoin } from "rxjs"
import { Cuotas } from "src/app/models/cuotas.model"

interface DashboardStats {
  totalMaquinas: number
  maquinasActivas: number
  totalOperarios: number
  operariosDisponibles: number
  serviciosPendientes: number
  serviciosCompletados: number
  mantenimientosPendientes: number
  mantenimientosRealizados: number
  totalObras: number
  obrasActivas: number
  totalGps: number
  gpsActivos: number
  totalEvidencias: number
}

interface ServiceRecord {
  id: string
  cliente: string
  tipoServicio: string
  operario: string
  maquina: string
  estado: "completado" | "en-progreso" | "programado" | "cancelado"
  fechaInicio: string
}

interface MaintenanceRecord {
  id: string
  maquina: string
  tipoMantenimiento: string
  responsable: string
  estado: "completado" | "en-progreso" | "programado"
  fechaProgramada: string
}

interface EntityCard {
  id: string
  name: string
  icon: string
  color: string
  count: number
  isOpen: boolean
  routes: {
    create: string
    list: string
  }
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {  stats: DashboardStats
  recentServices: ServiceRecord[]
  recentMaintenances: MaintenanceRecord[]
  entityCards: EntityCard[]
  cuotas: Cuotas[] = []
  loading = true
  user: Usuario | undefined

  constructor(
    private seguridadService: SeguridadService,
    private router: Router,
    private maquinaService: MaquinaService,
    private operarioService: OperarioService,
    private servicioService: ServicioService,
    private obraService: ObraService,
    private gpsService: GPSService,
    private evidenciaService: EvidenciaService,
    private mantenimientoService: MantenimientoService,
    private cuotasService: CuotasService
  ) {
    // Inicializar con valores por defecto
    this.stats = {
      totalMaquinas: 0,
      maquinasActivas: 0,
      totalOperarios: 0,
      operariosDisponibles: 0,
      serviciosPendientes: 0,
      serviciosCompletados: 0,
      mantenimientosPendientes: 0,
      mantenimientosRealizados: 0,
      totalObras: 0,
      obrasActivas: 0,
      totalGps: 0,
      gpsActivos: 0,
      totalEvidencias: 0,
    }

    this.recentServices = []
    this.recentMaintenances = []
    this.entityCards = []
  }

  ngOnInit(): void {
    this.loadUserFromSession();
    this.initializeEntityCards();
    
    // Solo cargar datos si el usuario está logueado
    if (this.isUserLoggedIn) {
      this.loadDashboardData();
    } else {
      this.loading = false;
    }
  }

  private loadUserFromSession(): void {
    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      try {
        const datosUsuario = JSON.parse(sesion);
        if (datosUsuario && (datosUsuario.nombre || datosUsuario.email)) {
          this.user = Object.assign(new Usuario(), datosUsuario);
        } else {
          this.user = undefined;
        }
      } catch (e) {
        console.error('Error al cargar usuario desde sesión:', e);
        this.user = undefined;
      }
    } else {
      this.user = undefined;
    }
  }

  // Getter para verificar si el usuario está logueado
  get isUserLoggedIn(): boolean {
    return !!(this.user && (this.user.nombre || this.user.email));
  }  private initializeEntityCards(): void {
    this.entityCards = [
      {
        id: 'maquinas',
        name: 'Máquinas',
        icon: 'bi-truck',
        color: 'primary',
        count: this.stats.totalMaquinas,
        isOpen: false,
        routes: {
          create: '/maquinas/create',
          list: '/maquinas/list'
        }
      },
      {
        id: 'obras',
        name: 'Obras',
        icon: 'bi-building',
        color: 'success',
        count: this.stats.totalObras,
        isOpen: false,
        routes: {
          create: '/obras/create',
          list: '/obras/list'
        }
      },
      {
        id: 'operarios',
        name: 'Operarios',
        icon: 'bi-person-gear',
        color: 'warning',
        count: this.stats.totalOperarios,
        isOpen: false,
        routes: {
          create: '/operario/create',
          list: '/operario/list'
        }
      },
      {
        id: 'servicios',
        name: 'Servicios',
        icon: 'bi-tools',
        color: 'info',
        count: this.stats.serviciosPendientes + this.stats.serviciosCompletados,
        isOpen: false,
        routes: {
          create: '/servicios/create',
          list: '/servicios/list'
        }
      },
      {
        id: 'gps',
        name: 'GPS',
        icon: 'bi-geo-alt',
        color: 'purple',
        count: this.stats.totalGps,
        isOpen: false,
        routes: {
          create: '/gps/create',
          list: '/gps/list'
        }
      },
      {
        id: 'evidencias',
        name: 'Evidencias',
        icon: 'bi-camera',
        color: 'danger',
        count: this.stats.totalEvidencias,
        isOpen: false,
        routes: {
          create: '/evidencias/create',
          list: '/evidencias/list'
        }
      }
    ];
  }  private loadDashboardData(): void {
    // Cargar datos reales desde el backend usando forkJoin para hacer todas las llamadas en paralelo
    const requests = forkJoin({
      maquinas: this.maquinaService.list(),
      operarios: this.operarioService.list(),
      servicios: this.servicioService.list(),
      obras: this.obraService.list(),
      gps: this.gpsService.list(),
      evidencias: this.evidenciaService.list(),
      mantenimientos: this.mantenimientoService.list(),
      cuotas: this.cuotasService.list()
    });

    requests.subscribe({
      next: (data) => {
        // Procesar datos reales del backend
        this.processBackendData(data);
        this.updateEntityCardsCount();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos del dashboard:', error);
        this.loading = false;
      }
    });
  }

  private processBackendData(data: any): void {
    // Procesar máquinas
    const maquinas = data.maquinas || [];
    const maquinasActivas = maquinas.filter((m: any) => m.estado === 'activo' || m.activo === true);

    // Procesar operarios
    const operarios = data.operarios || [];
    const operariosDisponibles = operarios.filter((o: any) => o.disponible === true || o.estado === 'disponible');

    // Procesar servicios
    const servicios = data.servicios || [];
    const serviciosPendientes = servicios.filter((s: any) => s.estado === 'pendiente' || s.estado === 'programado');
    const serviciosCompletados = servicios.filter((s: any) => s.estado === 'completado');

    // Procesar obras
    const obras = data.obras || [];
    const obrasActivas = obras.filter((o: any) => o.estado === 'activo' || o.activo === true);

    // Procesar GPS
    const gps = data.gps || [];
    const gpsActivos = gps.filter((g: any) => g.activo === true || g.estado === 'activo');    // Procesar evidencias
    const evidencias = data.evidencias || [];

    // Procesar mantenimientos
    const mantenimientos = data.mantenimientos || [];
    const mantenimientosPendientes = mantenimientos.filter((m: any) => m.estado === 'pendiente' || m.estado === 'programado');
    const mantenimientosRealizados = mantenimientos.filter((m: any) => m.estado === 'completado');

    // Procesar cuotas
    const cuotas = data.cuotas || [];
    this.cuotas = cuotas;

    // Actualizar estadísticas con datos reales
    this.stats = {
      totalMaquinas: maquinas.length,
      maquinasActivas: maquinasActivas.length,
      totalOperarios: operarios.length,
      operariosDisponibles: operariosDisponibles.length,
      serviciosPendientes: serviciosPendientes.length,
      serviciosCompletados: serviciosCompletados.length,
      mantenimientosPendientes: mantenimientosPendientes.length,
      mantenimientosRealizados: mantenimientosRealizados.length,
      totalObras: obras.length,
      obrasActivas: obrasActivas.length,
      totalGps: gps.length,
      gpsActivos: gpsActivos.length,
      totalEvidencias: evidencias.length,
    };

    // Procesar servicios recientes (últimos 5)
    this.recentServices = servicios
      .slice(0, 5)
      .map((service: any) => ({
        id: service.id || service._id,
        cliente: service.cliente || service.nombreCliente || 'N/A',
        tipoServicio: service.tipoServicio || service.tipo || 'N/A',
        operario: service.operario?.nombre || service.nombreOperario || 'N/A',
        maquina: service.maquina?.nombre || service.nombreMaquina || 'N/A',
        estado: service.estado || 'programado',
        fechaInicio: service.fechaInicio || service.fecha || new Date().toISOString()
      }));

    // Procesar mantenimientos recientes (últimos 5)
    this.recentMaintenances = mantenimientos
      .slice(0, 5)
      .map((maintenance: any) => ({
        id: maintenance.id || maintenance._id,
        maquina: maintenance.maquina?.nombre || maintenance.nombreMaquina || 'N/A',
        tipoMantenimiento: maintenance.tipo || maintenance.tipoMantenimiento || 'N/A',
        responsable: maintenance.responsable?.nombre || maintenance.nombreResponsable || 'N/A',
        estado: maintenance.estado || 'programado',
        fechaProgramada: maintenance.fechaProgramada || maintenance.fecha || new Date().toISOString()
      }));
  }

  getStatusBadgeClass(estado: string): string {
    switch (estado) {
      case "completado":
        return "bg-success"
      case "en-progreso":
        return "bg-warning text-dark"
      case "programado":
        return "bg-info"
      case "cancelado":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  getStatusLabel(estado: string): string {
    switch (estado) {
      case "completado":
        return "Completado"
      case "en-progreso":
        return "En Progreso"
      case "programado":
        return "Programado"
      case "cancelado":
        return "Cancelado"
      default:
        return estado
    }
  }  // Métodos para manejar las tarjetas de entidades
  toggleEntityCard(entityId: string): void {
    const card = this.entityCards.find(c => c.id === entityId);
    if (card) {
      // Cerrar todas las demás tarjetas
      this.entityCards.forEach(c => {
        if (c.id !== entityId) {
          c.isOpen = false;
        }
      });
      // Toggle la tarjeta actual
      card.isOpen = !card.isOpen;
    }
  }

  getEntityRoute(entityId: string, action: 'create' | 'list'): string {
    const card = this.entityCards.find(c => c.id === entityId);
    if (card) {
      return card.routes[action];
    }
    // Fallback para entidades que no están en entityCards (como mantenimientos)
    if (entityId === 'mantenimientos') {
      return action === 'create' ? '/mantenimientos/create' : '/mantenimientos/list';
    }
    return '/';
  }
  private updateEntityCardsCount(): void {
    this.entityCards.forEach(card => {
      switch (card.id) {
        case 'maquinas':
          card.count = this.stats.totalMaquinas;
          break;
        case 'obras':
          card.count = this.stats.totalObras;
          break;
        case 'operarios':
          card.count = this.stats.totalOperarios;
          break;
        case 'servicios':
          card.count = this.stats.serviciosPendientes + this.stats.serviciosCompletados;
          break;
        case 'gps':
          card.count = this.stats.totalGps;
          break;
        case 'evidencias':
          card.count = this.stats.totalEvidencias;
          break;
      }
    });
  }
  pagarCuota(cuotaId: number): void {
    this.router.navigate(['/cuotas', cuotaId, 'pay']);
  }
}
