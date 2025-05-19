import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mantenimiento } from 'src/app/models/mantenimiento.model';
import { MantenimientoService } from 'src/app/services/mantenimientoService/mantenimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  mantenimiento: Mantenimiento;

  constructor(private activateRoute: ActivatedRoute,
    private someMantenimiento: MantenimientoService,
    private router: Router
  ) {
    this.mantenimiento = { id: 0 }
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
      this.mantenimiento.id = this.activateRoute.snapshot.params.id  
      this.getMantenimiento(this.mantenimiento.id)
    }
  }
  getMantenimiento(id: number) {
    this.someMantenimiento.view(id).subscribe({
      next: (mantenimiento) => {
        this.mantenimiento = mantenimiento;
        console.log('mantenimiento fetched successfully:', this.mantenimiento);
      },
      error: (error) => {
        console.error('Error fetching mantenimiento:', error);
      }
    });
  }
  back() {
    this.router.navigate(['mantenimiento/list'])
  }
  create() {
    this.someMantenimiento.create(this.mantenimiento).subscribe({
      next: (mantenimiento) => {
        console.log('mantenimiento created successfully:', mantenimiento);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/mantenimiento/list']);
      },
      error: (error) => {
        console.error('Error creating mantenimiento:', error);
      }
    });
  }
  update() {
    this.someMantenimiento.update(this.mantenimiento).subscribe({
      next: (mantenimiento) => {
        console.log('mantenimiento updated successfully:', mantenimiento);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/mantenimiento/list']);
      },
      error: (error) => {
        console.error('Error updating mantenimiento:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete mantenimiento with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está mantenimiento que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someMantenimiento.delete(id).
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
