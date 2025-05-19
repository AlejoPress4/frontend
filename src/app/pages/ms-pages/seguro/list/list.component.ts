// insurance/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Seguro } from 'src/app/models/seguro.model';
import { SeguroService } from 'src/app/services/seguroService/seguro.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-Seguro',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListSeguroComponent implements OnInit {

  seguros: Seguro[] = []; // Array to store Seguros

  // Inject the SeguroService and Router (if needed)
  constructor(private SeguroService: SeguroService, private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of Seguros
    this.SeguroService.list().subscribe(data => {
      this.seguros = data; // Assign data to the Seguros array
    });
  }

  // Methods for edit and delete (adjust ID type based on your Seguro model)
  edit(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }

    this.router.navigate(['seguros/update', id]).then(
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
    console.log("Delete seguro with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.SeguroService.delete(id).
          subscribe(data => {
            Swal.fire(
              'Eliminado!',
              'Registro eliminado correctamente.',
              'success'
            )
            this.ngOnInit();
          });
      }
    })
    // Implement the call to the delete service method, e.g:
    // this.insuranceService.delete(id).subscribe(() => {
    //   console.log('Insurance deleted successfully');
    //   this.ngOnInit(); // Reload the list
    // });
  }
}