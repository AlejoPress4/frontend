// ObraMunicipio/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObraMunicipio } from 'src/app/models/obra-municipio.model';
import { ObraMunicipioService } from 'src/app/services/obraMunicipioService/obra-municipio.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-municipality-construction',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListObraMunicipioComponent implements OnInit {

  obramunicipios: ObraMunicipio[] = []; // Array to store links
  // Inject the service and Router (if needed)
  constructor(private ObraMunicipioService: ObraMunicipioService , private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list
    this.ObraMunicipioService.list().subscribe(data => {
      this.obramunicipios = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    this.router.navigate(['obra-municipio/update', id])
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
            this.ObraMunicipioService.delete(id).
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