// combos/list/list.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Combo } from 'src/app/models/combo.model';
import { CombosService } from 'src/app/services/comboService/combos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-combo',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComboComponent implements OnInit {

  combos: Combo[] = []; // Array to store combos

  constructor(private combosService: CombosService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('Componente ListComboComponent inicializado');
    this.combosService.list().subscribe(
      data => {
        console.log('Datos recibidos del servicio (subscribe):', data);
        this.combos = data;
        this.cdr.detectChanges();
        console.log('Variable combos del componente después de asignar:', this.combos);
      },
      error => {
        console.error('Error en la suscripción del servicio:', error);
      }
    );
    console.log('Llamada a combosService.list().subscribe() completada en ngOnInit');
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

    this.router.navigate(['/combos/update', id]).then(
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
      text: '¿Estás seguro de que deseas eliminar este combo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.combosService.delete(id).subscribe(
          () => {
            Swal.fire('Eliminado!', 'Combo eliminado con éxito.', 'success');
            this.combos = this.combos.filter(combo => combo.id !== id);
          },
          error => {
            console.error('Error al eliminar el combo:', error);
            Swal.fire('Error', 'Hubo un error al intentar eliminar el combo.', 'error');
          }
        );
      }
    });
  }

  view(id: number) {
    this.router.navigate(['/combos/view', id]);
  }
}