import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { GPS } from 'src/app/models/gps.model';
import { Maquina } from 'src/app/models/maquina.model';
import { GPSService } from 'src/app/services/gpsService/gps.service';
import { MaquinaService } from 'src/app/services/maquinaService/maquina.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  // Forms
  gpsForm: FormGroup;
  
  // Data
  gps: GPS = new GPS();
  maquinasDisponibles: Maquina[] = [];
  
  // Map configuration using @angular/google-maps - usando tipos genéricos para evitar "google is not defined"
  mapCenter: { lat: number, lng: number } = { lat: 4.6097, lng: -74.0817 }; // Bogotá, Colombia
  mapZoom = 10;
  mapOptions: any = {}; // Se configurará después de cargar Google Maps
  
  markerPosition: { lat: number, lng: number } | null = null;
  markerOptions: any = {}; // Se configurará después de cargar Google Maps
  
  // Mode management (1=view, 2=create, 3=update)
  mode = 2; // Default to create mode

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gpsService: GPSService,
    private maquinaService: MaquinaService,
    private googleMapsLoader: GoogleMapsLoaderService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadGoogleMaps();
    this.loadMaquinasDisponibles();
    this.checkRouteMode();
  }

  private initializeForm(): void {
    this.gpsForm = this.fb.group({
      latitud: ['', [
        Validators.required,
        Validators.min(-90),
        Validators.max(90)
      ]],
      longitud: ['', [
        Validators.required,
        Validators.min(-180),
        Validators.max(180)
      ]],
      maquina_id: ['', [
        Validators.required,
        Validators.min(1)
      ]]
    });
  }

  private loadGoogleMaps(): void {
    // Solución temporal: configurar opciones sin cargar dinámicamente
    console.log('Configurando mapa sin carga dinámica');
    
    this.mapOptions = {
      mapTypeId: 'roadmap',
      disableDoubleClickZoom: false,
      maxZoom: 18,
      minZoom: 3
    };
    
    this.markerOptions = {
      draggable: true,
      title: 'Ubicación GPS'
    };
    
    // El módulo GoogleMapsModule ya debe manejar la carga de la API
    console.log('Configuración del mapa establecida');
  }

  private loadMaquinasDisponibles(): void {
    this.maquinaService.list().subscribe({
      next: (maquinas: Maquina[]) => {
        this.maquinasDisponibles = maquinas || [];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading machines:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las máquinas disponibles'
        });
      }
    });
  }

  private checkRouteMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'view' ? 1 : 3;
      this.loadGps(parseInt(id));
    } else {
      this.mode = 2; // Create mode
    }
  }

  private loadGps(id: number): void {
    this.gpsService.view(id).subscribe({
      next: (gps: GPS) => {
        this.gps = gps;
        this.populateForm();
        this.updateMapFromGps();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading GPS:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del GPS'
        });
      }
    });
  }

  private populateForm(): void {
    this.gpsForm.patchValue({
      latitud: this.gps.latitud,
      longitud: this.gps.longitud,
      maquina_id: Array.isArray(this.gps.maquina_id) ? this.gps.maquina_id[0]?.id : this.gps.maquina_id
    });
  }

  private updateMapFromGps(): void {
    if (this.gps.latitud && this.gps.longitud) {
      const lat = parseFloat(this.gps.latitud);
      const lng = parseFloat(this.gps.longitud);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        this.mapCenter = { lat, lng };
        this.markerPosition = { lat, lng };
        this.mapZoom = 15;
      }
    }
  }

  // Map event handlers
  onMapClick(event: any): void {
    if (this.mode === 1) return; // No interaction in view mode
    
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      this.markerPosition = { lat, lng };
      this.gpsForm.patchValue({
        latitud: lat.toFixed(6),
        longitud: lng.toFixed(6)
      });
    }
  }

  onMarkerDragEnd(event: any): void {
    if (this.mode === 1) return; // No interaction in view mode
    
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      this.gpsForm.patchValue({
        latitud: lat.toFixed(6),
        longitud: lng.toFixed(6)
      });
    }
  }

  centerMapOnCoordinates(): void {
    const latValue = this.gpsForm.get('latitud')?.value;
    const lngValue = this.gpsForm.get('longitud')?.value;

    if (latValue && lngValue) {
      const lat = parseFloat(latValue);
      const lng = parseFloat(lngValue);

      if (!isNaN(lat) && !isNaN(lng)) {
        this.mapCenter = { lat, lng };
        this.markerPosition = { lat, lng };
        this.mapZoom = 15;
      }
    }
  }

  // CRUD operations
  create(): void {
    if (this.gpsForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.gpsForm.value;
    console.log('Form data:', formData);
    
    // Crear el objeto a enviar al backend (maquina_id como número)
    const gpsData = {
      latitud: formData.latitud.toString(),
      longitud: formData.longitud.toString(),
      maquina_id: parseInt(formData.maquina_id)
    };
    
    console.log('GPS data to send:', gpsData);

    this.gpsService.create(gpsData as any).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'GPS creado exitosamente'
        }).then(() => {
          this.router.navigate(['/pages/gps/list']);
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating GPS:', error);
        console.error('Error details:', error.error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Error al crear el GPS';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error && error.error.errors) {
          // Si es un error de validación de Adonis.js
          const errors = error.error.errors;
          errorMessage = Object.keys(errors).map(key => `${key}: ${errors[key]}`).join(', ');
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
      }
    });
  }

  update(): void {
    if (this.gpsForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.gpsForm.value;
    console.log('Update form data:', formData);
    
    // Crear el objeto a enviar al backend (maquina_id como número)
    const gpsData = {
      id: this.gps.id,
      latitud: formData.latitud.toString(),
      longitud: formData.longitud.toString(),
      maquina_id: parseInt(formData.maquina_id)
    };
    
    console.log('GPS data to update:', gpsData);

    this.gpsService.update(gpsData as any).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'GPS actualizado exitosamente'
        }).then(() => {
          this.router.navigate(['/pages/gps/list']);
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating GPS:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Error al actualizar el GPS'
        });
      }
    });
  }

  delete(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gpsService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'GPS eliminado exitosamente'
            }).then(() => {
              this.router.navigate(['/pages/gps/list']);
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error deleting GPS:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'Error al eliminar el GPS'
            });
          }
        });
      }
    });
  }

  back(): void {
    this.router.navigate(['/pages/gps/list']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.gpsForm.controls).forEach(key => {
      const control = this.gpsForm.get(key);
      control?.markAsTouched();
    });
  }
}
