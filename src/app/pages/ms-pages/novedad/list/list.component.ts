// novelty/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Novedad } from 'src/app/models/novedad.model';
import { NovedadService } from 'src/app/services/novedadService/novedad.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-novedad',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListNovedadComponent implements OnInit {

  novedades: Novedad[] = []; // Array to store novedades

  // Inject the service and Router (if needed)
  constructor(private NovedadService: NovedadService , private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list
    this.NovedadService.list().subscribe(data => {
      this.novedades = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    this.router.navigate(['novedades/update', id])
    // Implement navigation
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
            this.NovedadService.delete(id).
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