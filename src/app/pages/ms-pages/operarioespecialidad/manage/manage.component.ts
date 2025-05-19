import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperarioEspecialidad } from 'src/app/models/operario-especialidad.model';
import { OperarioEspecialidadService } from 'src/app/services/operarioEspecialidadService/operario-especialidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  operarioespecialidad: OperarioEspecialidad;

  constructor(private activateRoute: ActivatedRoute,
    private someOperarioEspecialidad: OperarioEspecialidadService,
    private router: Router
  ) {
    this.operarioespecialidad = { id: 0 }
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
      this.operarioespecialidad.id = this.activateRoute.snapshot.params.id
      this.getOperarioEspecialidad(this.operarioespecialidad.id)
    }
  }
  getOperarioEspecialidad(id: number) {
    this.someOperarioEspecialidad.view(id).subscribe({
      next: (operarioespecialidad) => {
        this.operarioespecialidad = operarioespecialidad;
        console.log('OperarioEspecialidad fetched successfully:', this.operarioespecialidad);
      },
      error: (error) => {
        console.error('Error fetching OperarioEspecialidad:', error);
      }
    });
  }
  back() {
    this.router.navigate(['especialidad-operarios/list'])
  }
  create() {
    this.someOperarioEspecialidad.create(this.operarioespecialidad).subscribe({
      next: (OperarioEspecialidad) => {
        console.log('OperarioEspecialidad created successfully:', OperarioEspecialidad);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/especialidad-operarios/list']);
      },
      error: (error) => {
        console.error('Error creating OperarioEspecialidad:', error);
      }
    });
  }
  update() {
    this.someOperarioEspecialidad.update(this.operarioespecialidad).subscribe({
      next: (operarioespecialidad) => {
        console.log('OperarioEspecialidad updated successfully:', operarioespecialidad);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/especialidad-operarios/list']);
      },
      error: (error) => {
        console.error('Error updating OperarioEspecialidad:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete OperarioEspecialidad with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está OperarioEspecialidad que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someOperarioEspecialidad.delete(id).
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
