import { Component, type OnInit, type OnDestroy, HostListener } from "@angular/core"
import { Usuario } from "src/app/models/usuario.model";
import { SeguridadService } from "src/app/services/seguridadService/seguridad.service"
import { Subscription } from "rxjs"
import {WebSocketService} from "src/app/services/Web-Socket/web-socket.service"


@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {  isMenuCollapsed = true;
  appTitle = "Gestión de Servicios de Transporte";
    menuItems: any[] = [];
  publicMenuItems: any[] = [];  privateMenuItems: any[] = [];
  user: Usuario;
  subscription: Subscription;
  showDropdown = false;
  notificationCount = 0;
    constructor(private seguridadService: SeguridadService, 
    private webSocketService: WebSocketService) {    this.subscription = this.seguridadService.getUsuario().subscribe((user: Usuario) => {
      this.user = user;
      this.updateMenuItems(); // Actualizar menú cuando cambie el usuario
    });
  }
  ngOnInit(): void {
    this.loadMenuItems();
    this.setupWebSocket();
    this.loadUserFromSession();
  }
  private setupWebSocket(): void {
    this.webSocketService.setNameEvent("newNotification");
    this.webSocketService.callback.subscribe((data: any) => {
      console.log("Nueva notificación recibida:", data);
      if (this.isUserLoggedIn) {
        this.notificationCount++;
      }
    });
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
    
    // Actualizar items del menú después de cargar el usuario
    this.updateMenuItems();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  private loadMenuItems(): void {
    // Items públicos (visibles sin login)
    this.publicMenuItems = [
      { title: "Inicio", route: "/", icon: "bi bi-house" },
      { title: "Acerca de", route: "/about", icon: "bi bi-info-circle" }
    ];

    // Items privados (solo visibles con login)
    this.privateMenuItems = [
      { title: "Dashboard", route: "/dashboard", icon: "bi bi-speedometer2" },
      { title: "Gestión de Flota", route: "/flota", icon: "bi bi-truck" },
      { title: "Servicios", route: "/servicios", icon: "bi bi-tools" },
      { title: "Cuotas", route: "/cuotas", icon: "bi bi-credit-card" },
      { title: "Mantenimiento", route: "/mantenimientos", icon: "bi bi-wrench" }
    ];

    // Combinar items según el estado de autenticación
    this.updateMenuItems();
  }

  private updateMenuItems(): void {
    if (this.isUserLoggedIn) {
      this.menuItems = [...this.publicMenuItems, ...this.privateMenuItems];
    } else {
      this.menuItems = [...this.publicMenuItems];
    }
  }  logout(): void {
    this.resetNavbarState();
    this.seguridadService.logout();
    window.location.href = '/login';
  }

  resetNavbarState(): void {
    this.showDropdown = false;
    this.notificationCount = 0;
    this.isMenuCollapsed = true;
  }

  toggleUserDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  clearNotifications(): void {
    this.notificationCount = 0;
    // Aquí podrías llamar a un servicio para marcar las notificaciones como leídas
    console.log('Notificaciones marcadas como leídas');
  }

  // Getter para verificar si el usuario está logueado
  get isUserLoggedIn(): boolean {
    return !!(this.user && (this.user.nombre || this.user.email));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const navbar = target.closest('.navbar');
    
    // Solo cerrar dropdowns si el clic fue fuera del navbar
    if (!navbar) {
      this.showDropdown = false;
    }
  }
}
