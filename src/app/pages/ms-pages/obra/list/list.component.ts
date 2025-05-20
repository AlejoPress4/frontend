// construction/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Obra } from 'src/app/models/obra.model';
import { ObraService } from 'src/app/services/obraService/obra.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-obra',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListObraComponent implements OnInit {

  obras: Obra[] = []; // Array to store Obras

  // Inject the ObraService and Router (if needed)
  constructor(private ObraService: ObraService , private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of Obras
    this.ObraService.list().subscribe(data => {
      this.obras = data; // Assign data to the Obras array
    });
  }

  // Methods for edit and delete (adjust ID type based on your Obra model)
  edit(id: number) {
    this.router.navigate(['obras/update', id]);
  }

  create() {
    this.router.navigate(['obras/create']);
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
            this.ObraService.delete(id).
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