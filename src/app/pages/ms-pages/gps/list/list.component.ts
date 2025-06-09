// gps/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GPS } from 'src/app/models/gps.model';
import { GPSService } from 'src/app/services/gpsService/gps.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-gps',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListGpsComponent implements OnInit {
  gpsPoints: GPS[] = []; // Array to store GPS points
  loading = true; // Estado de carga
  error: string | null = null; // Estado de error
  
  // Configuración del mapa - usando tipos genéricos para evitar "google is not defined"
  mapCenter: { lat: number, lng: number } = { lat: 4.7110, lng: -74.0721 }; // Bogotá
  mapZoom = 10; // Un poco más alejado para ver todos los puntos
  mapOptions: any = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 8
  };
  
  showMap = false; // Control para mostrar/ocultar el mapa

  constructor(
    private gpsService: GPSService, 
    private router: Router,
    private googleMapsLoader: GoogleMapsLoaderService
  ) { }  ngOnInit(): void {
    console.log('ListGpsComponent initialized');
    // Call the service to get the list of GPS points
    this.gpsService.list().subscribe({      next: (data) => {
        this.loading = false;
        console.log('GPS data received from backend:', data);
        console.log('Type of data:', typeof data);
        console.log('Is data an array?', Array.isArray(data));
          // Asegurar que data sea un array
        if (Array.isArray(data)) {
          this.gpsPoints = data;
        } else if (data) {
          // Si es un objeto con una propiedad que contiene el array
          this.gpsPoints = (data as any).data || (data as any).gps || [data];
        } else {
          this.gpsPoints = [];
        }
        
        console.log('GPS points assigned:', this.gpsPoints);
        console.log('Number of GPS points:', this.gpsPoints.length);
        
        // Centrar el mapa en base a los puntos GPS disponibles
        if (this.gpsPoints.length > 0) {
          this.centerMapOnGPSPoints();
        } else {
          console.warn('No GPS points found to display');
        }
      },      error: (error) => {
        this.loading = false;
        this.error = `Error cargando puntos GPS: ${error.message}`;
        console.error('Error loading GPS points:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        this.gpsPoints = [];
      }
    });
  }

  centerMapOnGPSPoints(): void {
    if (this.gpsPoints.length === 0) return;
    
    // Calcular el centro promedio de todos los puntos GPS
    let totalLat = 0;
    let totalLng = 0;
    let validPoints = 0;
      this.gpsPoints.forEach(gps => {
      if (gps.latitud && gps.longitud) {
        totalLat += parseFloat(gps.latitud);
        totalLng += parseFloat(gps.longitud);
        validPoints++;
      }
    });
    
    if (validPoints > 0) {
      this.mapCenter = {
        lat: totalLat / validPoints,
        lng: totalLng / validPoints
      };
    }
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    if (this.showMap) {
      this.centerMapOnGPSPoints();
    }
  }
  onMarkerClick(gps: GPS): void {
    Swal.fire({
      title: 'Información del GPS',
      html: `
        <div class="text-left">
          <p><strong>ID:</strong> ${gps.id}</p>
          <p><strong>Latitud:</strong> ${gps.latitud}</p>
          <p><strong>Longitud:</strong> ${gps.longitud}</p>
          <p><strong>Máquina ID:</strong> ${gps.maquina_id}</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.edit(gps.id!);
      }
    });
  }

  // Methods for edit and delete (adjust ID type based on your Gps model)
  edit(id: number) {
    this.router.navigate(['gps/update', id])
    // Implement navigation, e.g: this.router.navigate(['/admin/gps/edit', id]);
  }

  delete(id: number) {
  console.log("Delete seguro with id:", id);
        Swal.fire({
          title: 'Eliminar',
          text: "Está seguro que quiere eliminar el registro?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.gpsService.delete(id).
              subscribe(data => {
                Swal.fire(
                  'Eliminado!',
                  'Registro eliminado correctamente.',
                  'success'
                )
                this.ngOnInit();
              });
          }
        })
  }
  getCoordinates(gps: GPS): { lat: number, lng: number } {
    return {
      lat: parseFloat(gps.latitud || '0'),
      lng: parseFloat(gps.longitud || '0')
    };
  }
}