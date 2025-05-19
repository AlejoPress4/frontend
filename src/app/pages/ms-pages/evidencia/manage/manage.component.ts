import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evidencia } from 'src/app/models/evidencia.model';
import { EvidenciaService } from 'src/app/services/evidenciaService/evidencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  evidencia: Evidencia;

  constructor(private activateRoute: ActivatedRoute,
    private evidenciaService: EvidenciaService,
    private router: Router
  ) {
    this.evidencia = { id: 0 };
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.evidencia.id = this.activateRoute.snapshot.params.id;
      this.getEvidencia(this.evidencia.id);
    }
  }

  getEvidencia(id: number) {
    this.evidenciaService.view(id).subscribe({
      next: (evidencia) => {
        this.evidencia = evidencia;
        console.log('Evidencia fetched successfully:', this.evidencia);
      },
      error: (error) => {
        console.error('Error fetching evidencia:', error);
        Swal.fire('Error', 'No se pudo obtener la evidencia.', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['evidencias/list']);
  }

  create() {
    if (!this.validateEvidencia()) {
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    this.evidenciaService.create(this.evidencia).subscribe({
      next: (evidencia) => {
        console.log('Evidencia created successfully:', evidencia);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/evidencias/list']);
        });
      },
      error: (error) => {
        console.error('Error creating evidencia:', error);
        Swal.fire('Error', 'No se pudo crear el registro.', 'error');
      }
    });
  }

  update() {
    if (!this.validateEvidencia()) {
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    this.evidenciaService.update(this.evidencia).subscribe({
      next: (evidencia) => {
        console.log('Evidencia updated successfully:', evidencia);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/evidencias/list']);
        });
      },
      error: (error) => {
        console.error('Error updating evidencia:', error);
        Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
      }
    });
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
            this.router.navigate(['/evidencias/list']);
          },
          error: (error) => {
            console.error('Error al eliminar la evidencia:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
  private validateEvidencia(): boolean {
    return !!this.evidencia.tipo_de_archivo && !!this.evidencia.contenido_archivo && !!this.evidencia.fecha_de_carga && !!this.evidencia.id_servicio;
  }
}
