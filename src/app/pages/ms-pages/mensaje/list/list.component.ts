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
  constructor(private MensajeService: MensajeService , private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of Mensajes
    this.MensajeService.list().subscribe(data => {
      this.mensajes = data; // Assign data to the Mensajes array
    });
  }

  // Methods for edit and delete (adjust ID type based on your Mensaje model)
  edit(id: number) {
    this.router.navigate(['mensajes/update', id])
    // Implement navigation, e.g: this.router.navigate(['/admin/Mensaje/edit', id]);
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
            this.MensajeService.delete(id).
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
  }
}