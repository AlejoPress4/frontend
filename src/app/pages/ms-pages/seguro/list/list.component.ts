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
  constructor(private SeguroService: SeguroService , private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of Seguros
    this.SeguroService.list().subscribe(data => {
      this.seguros = data; // Assign data to the Seguros array
    });
  }

  // Methods for edit and delete (adjust ID type based on your Seguro model)
  edit(id: number) {
    this.router.navigate(['seguros/update', id])
    // Implement navigation, e.g: this.router.navigate(['/admin/Seguro/edit', id]);
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