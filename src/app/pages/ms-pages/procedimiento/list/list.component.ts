// procedure/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Procedimiento } from 'src/app/models/procedimiento.model';
import { ProcedimientoService } from 'src/app/services/procedimientoService/procedimiento.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-Procedimiento',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListProcedimientoComponent implements OnInit {

  procedimientos: Procedimiento[] = []; // Renombré la propiedad para que sea consistente con el HTML y esté en minúsculas

  // Inject the service and Router (if needed)
  constructor(private procedimientoService: ProcedimientoService , private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list
    this.procedimientoService.list().subscribe(data => {
      this.procedimientos = data; // Asigna los datos a la propiedad renombrada
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
   this.router.navigate(['procedimientos/update', id])
    // Implement navigation
  }

  delete(id: number) {
    console.log("Delete procedimiento with id:", id);
        Swal.fire({
          title: 'Eliminar',
          text: "Está procedimiento que quiere eliminar el registro?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) { 
            this.procedimientoService.delete(id).
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