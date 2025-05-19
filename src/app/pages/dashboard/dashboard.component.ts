import { Component, type OnInit } from "@angular/core"

interface DashboardStats {
  totalVehicles: number
  activeVehicles: number
  totalDrivers: number
  activeRoutes: number
  pendingServices: number
  completedServices: number
}

interface ServiceRecord {
  id: string
  origin: string
  destination: string
  driver: string
  status: "completed" | "in-progress" | "scheduled" | "cancelled"
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats
  recentServices: ServiceRecord[]
  loading = true

  constructor() {
    // Inicializar con valores por defecto
    this.stats = {
      totalVehicles: 0,
      activeVehicles: 0,
      totalDrivers: 0,
      activeRoutes: 0,
      pendingServices: 0,
      completedServices: 0,
    }

    this.recentServices = []
  }

  ngOnInit(): void {
    // Simular carga de datos desde un servicio
    setTimeout(() => {
      this.loadDashboardData()
      this.loading = false
    }, 1000)
  }

  private loadDashboardData(): void {
    // En un caso real, estos datos vendrían de un servicio
    this.stats = {
      totalVehicles: 45,
      activeVehicles: 32,
      totalDrivers: 50,
      activeRoutes: 28,
      pendingServices: 12,
      completedServices: 145,
    }

    this.recentServices = [
      { id: "#1234", origin: "Ciudad A", destination: "Ciudad B", driver: "Juan Pérez", status: "completed" },
      { id: "#1235", origin: "Ciudad C", destination: "Ciudad D", driver: "María López", status: "in-progress" },
      { id: "#1236", origin: "Ciudad B", destination: "Ciudad E", driver: "Carlos Gómez", status: "scheduled" },
      { id: "#1237", origin: "Ciudad F", destination: "Ciudad A", driver: "Ana Martínez", status: "cancelled" },
      { id: "#1238", origin: "Ciudad D", destination: "Ciudad C", driver: "Roberto Sánchez", status: "completed" },
    ]
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "completed":
        return "bg-success"
      case "in-progress":
        return "bg-warning text-dark"
      case "scheduled":
        return "bg-info"
      case "cancelled":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "completed":
        return "Completado"
      case "in-progress":
        return "En progreso"
      case "scheduled":
        return "Programado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }
}
