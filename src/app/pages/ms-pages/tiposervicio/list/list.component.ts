// typeservice/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoServicio } from 'src/app/models/tipo-servicio.model';
import { TipoServicioService } from 'src/app/services/tipoServicioService/tipo-servicio.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-list-tipo-servicio',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListTipoServicioComponent implements OnInit {

  TipoServicios: TipoServicio[] = []; // Array to store service types

  // Inject the service and Router (if needed)
  constructor(private TipoServicioService: TipoServicioService, private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list
    this.TipoServicioService.list().subscribe(data => {
      this.TipoServicios = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    this.router.navigate(['/tiposervicio/update', id])
    // Implement navigation
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que desea eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.TipoServicioService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar el tipo de servicio:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}