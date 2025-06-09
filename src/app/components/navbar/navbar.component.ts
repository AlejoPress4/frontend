import { Component, type OnInit } from "@angular/core"
import { Usuario } from "src/app/models/usuario.model";
import { SeguridadService } from "src/app/services/seguridadService/seguridad.service"
import { Subscription } from "rxjs"
import {WebSocketService} from "src/app/services/Web-Socket/web-socket.service"


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
  showDropdown = false;
  constructor(private seguridadService: SeguridadService, 
    private webSocketService: WebSocketService,) {
    // Aquí puedes inyectar servicios si los necesitas
    // Por ejemplo: private authService: AuthService
    this.subscription = this.seguridadService.getUsuario().subscribe((user: Usuario) => {
      this.user = user
    })
  }

  ngOnInit(): void {
    // Inicializar datos al cargar el componente
    this.loadMenuItems();
    this.webSocketService.setNameEvent("newNotification");
    this.webSocketService.callback.subscribe((data: any) => {
      console.log("Nueva notificación recibida:", data);
      // Aquí puedes manejar la notificación recibida
    });
    // Forzar actualización del usuario al recargar
    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      try {
        const datosUsuario = JSON.parse(sesion);
        // Aseguramos que user sea una instancia de Usuario
        if (datosUsuario && (datosUsuario.nombre || datosUsuario.email)) {
          this.user = Object.assign(new Usuario(), datosUsuario);
        } else {
          this.user = undefined;
        }
      } catch (e) {
        this.user = undefined;
      }
    } else {
      this.user = undefined;
    }
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

  logout() {
    this.seguridadService.logout();
    window.location.href = '/login';
  }
}
