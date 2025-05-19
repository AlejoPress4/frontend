import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Factura } from 'src/app/models/factura.model';
import { FacturaService } from 'src/app/services/facturaService/factura.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-factura',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListFacturaComponent implements OnInit {

  facturas: Factura[] = [];

  constructor(private facturaService: FacturaService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.facturaService.list().subscribe(
      data => {
        this.facturas = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error al obtener las facturas:', error);
        Swal.fire('Error', 'No se pudieron cargar las facturas.', 'error');
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

    this.router.navigate([`/facturas/update`, id]).then(
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
        this.facturaService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.facturas = this.facturas.filter(factura => factura.id !== id);
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error al eliminar la factura:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }

  view(id: number) {
    this.router.navigate([`/facturas/view`, id]);
  }

  navigateToCreate() {
    this.router.navigate(['/facturas/create']).then(
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