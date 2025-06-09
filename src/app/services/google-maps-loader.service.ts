import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private scriptLoaded = false;
  private scriptLoading = false;

  constructor() { }
  /**
   * Carga el script de Google Maps API dinámicamente usando la configuración del environment
   */
  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resolver inmediatamente
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      // Si ya se está cargando, esperar
      if (this.scriptLoading) {
        // Polling hasta que se cargue
        const checkInterval = setInterval(() => {
          if (this.scriptLoaded) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      this.scriptLoading = true;

      // Crear el script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      
      // Usar la configuración del environment con parámetros adicionales para evitar CORS
      const apiKey = environment.googleMaps.apiKey;
      const libraries = 'geometry,places';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&callback=initMap&v=weekly`;
        // Crear callback global temporal
      (window as any).initMap = () => {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        delete (window as any).initMap;
        resolve();
      };

      // Manejar errores
      script.onerror = (error) => {
        this.scriptLoading = false;
        console.error('Error al cargar Google Maps API:', error);
        reject(error);
      };

      // Agregar el script al head
      document.head.appendChild(script);
    });
  }
  /**
   * Obtiene la API key de Google Maps del environment
   */
  getGoogleMapsApiKey() {
    return environment.googleMaps.apiKey;
  }

  /**
   * Verifica si Google Maps API está disponible
   */
  isGoogleMapsLoaded(): boolean {
    return this.scriptLoaded && typeof google !== 'undefined' && typeof google.maps !== 'undefined';
  }
}
