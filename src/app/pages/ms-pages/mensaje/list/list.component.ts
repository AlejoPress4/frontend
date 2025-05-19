// message/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mensaje } from 'src/app/models/mensaje.model';
import { MensajeService } from 'src/app/services/mensajeService/mensaje.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-Mensaje',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListMensajeComponent implements OnInit {

  mensajes: Mensaje[] = []; // Array to store Mensajes

  // Inject the MensajeService and Router (if needed)
  constructor(private MensajeService: MensajeService, private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of Mensajes
    this.MensajeService.list().subscribe(data => {
      this.mensajes = data; // Assign data to the Mensajes array
    });
  }

  // Methods for edit and delete (adjust ID type based on your Mensaje model)
  edit(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }

    this.router.navigate([`/mensajes/update`, id]).then(
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
        this.MensajeService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar el mensaje:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}