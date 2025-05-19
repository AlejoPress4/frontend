// machineryspeciality/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { EspecialidadMaquinaria } from 'src/app/models/especialidad-maquinaria.model';
import { EspecialidadMaquinariaService } from 'src/app/services/especialidadMaquinariaService/especialidad-maquina.service';
import { Router } from '@angular/router'; // Import Router if you need navigation
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-machinery-speciality',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListEspecialidadMaquinariaComponent implements OnInit {

  especialidadesmaquinaria: EspecialidadMaquinaria[] = []; // Array to store machinery-speciality links

  // Inject the especialidadMaquinariaService and Router (if needed)
  constructor(private EspecialidadMaquinariaService: EspecialidadMaquinariaService, private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of links
    this.EspecialidadMaquinariaService.list().subscribe(data => {
      this.especialidadesmaquinaria = data; // Assign data to the machinerySpecialities array
    });
  }

  // Methods for edit and delete (adjust ID type based on your especialidadMaquinaria model)
  edit(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }

    this.router.navigate([`/especialidad-maquinaria/update`, id]).then(
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
        this.EspecialidadMaquinariaService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar la especialidad de maquinaria:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}