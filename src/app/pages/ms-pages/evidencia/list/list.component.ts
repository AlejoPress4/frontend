import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Evidencia } from 'src/app/models/evidencia.model';
import { Servicio } from 'src/app/models/servicio.model';
import { Novedad } from 'src/app/models/novedad.model';
import { EvidenciaService } from 'src/app/services/evidenciaService/evidencia.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-evidencia',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListEvidenciaComponent implements OnInit {

  evidencias: Evidencia[] = [];
  servicios: Servicio[] = [];
  novedades: Novedad[] = [];

  constructor(private evidenciaService: EvidenciaService, private router: Router, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load all data
    this.evidenciaService.list().subscribe({
      next: (data) => {
        this.evidencias = data.map(evidencia => ({
          ...evidencia,
          foto_url: evidencia.id ? this.evidenciaService.getPhotoUrl(evidencia.id) : undefined
        }));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener las evidencias:', error);
        Swal.fire('Error', 'No se pudieron cargar las evidencias.', 'error');
      }
    });

    // Load servicios for reference
    this.evidenciaService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
      },
      error: (error) => {
        console.error('Error loading servicios:', error);
      }
    });

    // Load novedades for reference
    this.evidenciaService.getNovedades().subscribe({
      next: (novedades) => {
        this.novedades = novedades;
      },
      error: (error) => {
        console.error('Error loading novedades:', error);
      }
    });
  }

  edit(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }

    this.router.navigate([`/evidencias/update`, id]).then(
      success => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Redirigido',
            text: 'Navegación exitosa al formulario de edición.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo navegar al formulario de edición.'
          });
        }
      },
      error => {
        console.error('Error al navegar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar navegar al formulario de edición.'
        });
      }
    );
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que quiere eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.evidenciaService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.evidencias = this.evidencias.filter(evidencia => evidencia.id !== id);
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error al eliminar la evidencia:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }

  view(id: number) {
    this.router.navigate([`/evidencias/view`, id]);
  }

  navigateToCreate() {
    this.router.navigate(['/evidencias/create']).then(
      success => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Redirigido',
            text: 'Navegación exitosa al formulario de creación.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo navegar al formulario de creación.'
          });
        }
      },
      error => {
        console.error('Error al navegar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar navegar al formulario de creación.'
        });
      }
    );
  }
  // Helper methods for display
  getServicioName(servicioId: any): string {
    if (Array.isArray(servicioId) && servicioId.length > 0) {
      const servicio = this.servicios.find(s => s.id === servicioId[0].id);
      return servicio?.resumen || `Servicio ${servicioId[0].id}`;
    }
    return 'No asignado';
  }

  getNovedadName(novedadId: any): string {
    if (Array.isArray(novedadId) && novedadId.length > 0) {
      const novedad = this.novedades.find(n => n.id === novedadId[0].id);
      return novedad?.descripcion || `Novedad ${novedadId[0].id}`;
    }
    return 'No asignado';
  }

  getPhotoUrl(evidenciaId: number | undefined): string | null {
    return evidenciaId ? this.evidenciaService.getPhotoUrl(evidenciaId) : null;
  }

  // Show image in modal
  showImageModal(imageUrl: string): void {
    Swal.fire({
      imageUrl: imageUrl,
      imageWidth: 600,
      imageHeight: 400,
      imageAlt: 'Evidencia',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        image: 'img-fluid'
      }
    });
  }
}