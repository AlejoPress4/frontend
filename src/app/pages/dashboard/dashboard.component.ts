import { Component, type OnInit } from "@angular/core"
import { SeguridadService } from "src/app/services/seguridadService/seguridad.service"
import { Usuario } from "src/app/models/usuario.model"

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

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats
  recentServices: ServiceRecord[]
  recentMaintenances: MaintenanceRecord[]
  loading = true
  user: Usuario | undefined

  constructor(private seguridadService: SeguridadService) {
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
    }

    this.recentServices = []
    this.recentMaintenances = []
  }
  ngOnInit(): void {
    this.loadUserFromSession();
    
    // Solo cargar datos si el usuario está logueado
    if (this.isUserLoggedIn) {
      // Simular carga de datos desde un servicio
      setTimeout(() => {
        this.loadDashboardData()
        this.loading = false
      }, 1000)
    } else {
      this.loading = false
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
  }

  private loadDashboardData(): void {
    // En un caso real, estos datos vendrían de servicios backend
    this.stats = {
      totalMaquinas: 45,
      maquinasActivas: 32,
      totalOperarios: 50,
      operariosDisponibles: 35,
      serviciosPendientes: 12,
      serviciosCompletados: 145,
      mantenimientosPendientes: 8,
      mantenimientosRealizados: 78,
      totalObras: 15,
      obrasActivas: 8,
    }

    this.recentServices = [
      { 
        id: "#SRV-001", 
        cliente: "Municipio de Bogotá", 
        tipoServicio: "Transporte de Materiales", 
        operario: "Juan Pérez", 
        maquina: "Camión CAT-001",
        estado: "completado",
        fechaInicio: "2024-01-15"
      },
      { 
        id: "#SRV-002", 
        cliente: "Constructora ABC", 
        tipoServicio: "Excavación", 
        operario: "María López", 
        maquina: "Excavadora EXC-002",
        estado: "en-progreso",
        fechaInicio: "2024-01-16"
      },
      { 
        id: "#SRV-003", 
        cliente: "Vías y Obras SA", 
        tipoServicio: "Nivelación", 
        operario: "Carlos Gómez", 
        maquina: "Motoniveladora MOT-003",
        estado: "programado",
        fechaInicio: "2024-01-18"
      },
      { 
        id: "#SRV-004", 
        cliente: "Alcaldía Municipal", 
        tipoServicio: "Limpieza Vial", 
        operario: "Ana Martínez", 
        maquina: "Barredora BAR-001",
        estado: "cancelado",
        fechaInicio: "2024-01-17"
      },
    ]

    this.recentMaintenances = [
      {
        id: "#MNT-001",
        maquina: "Camión CAT-001", 
        tipoMantenimiento: "Mantenimiento Preventivo",
        responsable: "Taller Central",
        estado: "completado",
        fechaProgramada: "2024-01-10"
      },
      {
        id: "#MNT-002",
        maquina: "Excavadora EXC-002", 
        tipoMantenimiento: "Cambio de Aceite",
        responsable: "Mecánico Principal",
        estado: "en-progreso",
        fechaProgramada: "2024-01-16"
      },
      {
        id: "#MNT-003",
        maquina: "Motoniveladora MOT-003", 
        tipoMantenimiento: "Revisión General",
        responsable: "Taller Especializado",
        estado: "programado",
        fechaProgramada: "2024-01-20"
      }
    ]
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
  }
}
