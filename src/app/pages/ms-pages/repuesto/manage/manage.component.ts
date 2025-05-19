import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Repuesto } from 'src/app/models/repuesto.model';
import { RepuestoService } from 'src/app/services/repuestoService/repuesto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  repuesto: Repuesto;

  constructor(private activateRoute: ActivatedRoute,
    private someRepuesto: RepuestoService,
    private router: Router
  ) {
    this.repuesto = { id: 0 }
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
      this.repuesto.id = this.activateRoute.snapshot.params.id  
      this.getRepuesto(this.repuesto.id)
    }
  }
  getRepuesto(id: number) {
    this.someRepuesto.view(id).subscribe({
      next: (repuesto) => {
        this.repuesto = repuesto;
        console.log('repuesto fetched successfully:', this.repuesto);
      },
      error: (error) => {
        console.error('Error fetching repuesto:', error);
      }
    });
  }
  back() {
    this.router.navigate(['repuesto/list'])
  }
  create() {
    this.someRepuesto.create(this.repuesto).subscribe({
      next: (repuesto) => {
        console.log('repuesto created successfully:', repuesto);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/repuesto/list']);
      },
      error: (error) => {
        console.error('Error creating repuesto:', error);
      }
    });
  }
  update() {
    this.someRepuesto.update(this.repuesto).subscribe({
      next: (repuesto) => {
        console.log('repuesto updated successfully:', repuesto);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/repuesto/list']);
      },
      error: (error) => {
        console.error('Error updating repuesto:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete repuesto with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está repuesto que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someRepuesto.delete(id).
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
