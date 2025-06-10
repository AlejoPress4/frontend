import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cuotas } from 'src/app/models/cuotas.model';
import { CuotasService } from 'src/app/services/cuotasService/cuotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-quota',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListCuotaComponent implements OnInit {

  cuotas: Cuotas[] = [];

  constructor(private cuotasService: CuotasService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cuotasService.list().subscribe(
      data => {
        this.cuotas = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error al cargar las cuotas:', error);
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

    this.router.navigate([`/cuotas/update`, id]).then(
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
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuotasService.delete(id).subscribe(
          () => {
            this.cuotas = this.cuotas.filter(cuota => cuota.id !== id);
            Swal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
          },
          error => {
            console.error('Error al eliminar la cuota:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al intentar eliminar la cuota.'
            });
          }
        );
      }
    });
  }

  pagarCuota(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }

    this.router.navigate(['/cuotas', id, 'pay']);
  }

  update(cuota: Cuotas) {
    this.cuotasService.update(cuota).subscribe(
      () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/cuotas/list']);
        });
      },
      error => {
        console.error('Error al actualizar la cuota:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al intentar actualizar la cuota.'
        });
      }
    );
  }
}