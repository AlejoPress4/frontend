// maintenance/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mantenimiento } from 'src/app/models/mantenimiento.model';
import { MantenimientoService } from 'src/app/services/mantenimientoService/mantenimiento.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-Mantenimiento',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListMantenimientoComponent implements OnInit {

  mantenimientos: Mantenimiento[] = []; // Array to store Mantenimientos

  // Inject the MantenimientoService and Router (if needed)
  constructor(private MantenimientoService: MantenimientoService , private router: Router ) { }

  ngOnInit(): void {
    // Call the service to get the list of Mantenimientos
    this.MantenimientoService.list().subscribe(data => {
      this.mantenimientos = data; // Assign data to the Mantenimientos array
    });
  }

  // Methods for edit and delete (adjust ID type based on your Mantenimiento model)
  edit(id: number) {
    this.router.navigate(['mantenimiento/update', id])
    // Implement navigation, e.g: this.router.navigate(['/admin/Mantenimiento/edit', id]);
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
            this.MantenimientoService.delete(id).
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