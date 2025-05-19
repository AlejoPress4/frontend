import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Especialidad } from 'src/app/models/especialidad.model';
import { EspecialidadesService } from 'src/app/services/especialidadesService/especialidades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  especialidad: Especialidad;

  constructor(private activateRoute: ActivatedRoute,
    private someEspecialidad: EspecialidadesService,
    private router: Router
  ) {
    this.especialidad = { id: 0 }
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
      this.especialidad.id = this.activateRoute.snapshot.params.id
      this.getEspecialidad(this.especialidad.id)
    }
  }
  getEspecialidad(id: number) {
    this.someEspecialidad.view(id).subscribe({
      next: (especialidad) => {
        this.especialidad = especialidad;
        console.log('especialidad fetched successfully:', this.especialidad);
      },
      error: (error) => {
        console.error('Error fetching especialidad:', error);
      }
    });
  }
  back() {
    this.router.navigate(['especialidades/list'])
  }
  create() {
    this.someEspecialidad.create(this.especialidad).subscribe({
      next: (especialidad) => {
        console.log('especialidad created successfully:', especialidad);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/especialidades/list']);
      },
      error: (error) => {
        console.error('Error creating especialidad:', error);
      }
    });
  }
  update() {
    this.someEspecialidad.update(this.especialidad).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/especialidades/list']); // Redirigir a la lista
        });
      },
      error: (error) => {
        console.error('Error al actualizar la especialidad:', error);
        Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
      }
    });
  }
  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que quiere eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someEspecialidad.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar la especialidad:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}
