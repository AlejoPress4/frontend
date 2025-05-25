import { Component, type OnInit } from "@angular/core"
import { Usuario } from "src/app/models/usuario.model";
import { SeguridadService } from "src/app/services/seguridadService/seguridad.service"
import { Subscription } from "rxjs"

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true
  appTitle = "Gestión de Servicios de Transporte"
  menuItems: any[] = []
  user: Usuario;
  subscription: Subscription;

  constructor(private seguridadService: SeguridadService) {
    // Aquí puedes inyectar servicios si los necesitas
    // Por ejemplo: private authService: AuthService
    this.subscription = this.seguridadService.getUsuario().subscribe((user: Usuario) => {
      this.user = user
    })
  }

  ngOnInit(): void {
    // Inicializar datos al cargar el componente
    this.loadMenuItems()
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed
  }
  private loadMenuItems(): void {
    this.menuItems = [
      { title: "Dashboard", route: "/dashboard", icon: "bi bi-speedometer2" },
      { title: "Vehículos", route: "/maquina", icon: "bi bi-truck" },
      { title: "Servicios", route: "/servicio", icon: "bi bi-tools" },
      { title: "Mantenimientos", route: "/mantenimientos", icon: "bi bi-wrench" },
      { title: "Reportes", route: "/evidencias", icon: "bi bi-file-text" },
    ]
  }
}
