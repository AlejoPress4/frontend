import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Evidencia } from 'src/app/models/evidencia.model';
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

  constructor(private evidenciaService: EvidenciaService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.evidenciaService.list().subscribe(
      data => {
        this.evidencias = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error al obtener las evidencias:', error);
        Swal.fire('Error', 'No se pudieron cargar las evidencias.', 'error');
      }
    );
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
}