// combomachinery/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaquinaCombo } from 'src/app/models/maquina-combo.model';
import { MaquinaComboService } from 'src/app/services/maquinaComboService/maquina-combo.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-combo-machinery',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListMaquinaComboComponent implements OnInit {

  maquinacombos: MaquinaCombo[] = []; // Array to store combo-machinery links

  // Inject the MaquinaComboService and Router (if needed)
  constructor(private MaquinaComboService: MaquinaComboService, private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of links
    this.MaquinaComboService.list().subscribe(data => {
      this.maquinacombos = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your MaquinaCombo model)
  edit(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }

    this.router.navigate([`/maquina-combo/update`, id]).then(
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
        this.MaquinaComboService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar el enlace de maquinaria y combo:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}