import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Novedad } from 'src/app/models/novedad.model';
import { NovedadService } from 'src/app/services/novedadService/novedad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {


  mode: number; //1->View, 2->Create, 3-> Update
  novedad: Novedad;

  constructor(private activateRoute: ActivatedRoute,
    private someNovedad: NovedadService,
    private router: Router
  ) {
    this.novedad = { id: 0 }
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.novedad.id = this.activateRoute.snapshot.params.id  
      this.getNovedad(this.novedad.id)
    }
  }
  getNovedad(id: number) {
    this.someNovedad.view(id).subscribe({
      next: (novedad) => {
        this.novedad = novedad;
        console.log('novedad fetched successfully:', this.novedad);
      },
      error: (error) => {
        console.error('Error fetching novedad:', error);
      }
    });
  }
  back() {
    this.router.navigate(['novedad/list'])
  }
  create() {
    this.someNovedad.create(this.novedad).subscribe({
      next: (novedad) => {
        console.log('novedad created successfully:', novedad);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/novedad/list']);
      },
      error: (error) => {
        console.error('Error creating novedad:', error);
      }
    });
  }
  update() {
    this.someNovedad.update(this.novedad).subscribe({
      next: (novedad) => {
        console.log('novedad updated successfully:', novedad);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/novedad/list']);
      },
      error: (error) => {
        console.error('Error updating novedad:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete novedad with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está novedad que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someNovedad.delete(id).
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
