import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EspecialidadMaquinaria } from 'src/app/models/especialidad-maquinaria.model';
import { EspecialidadMaquinariaService } from 'src/app/services/especialidadMaquinariaService/especialidad-maquina.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  especialidadmaquinaria: EspecialidadMaquinaria;

  constructor(private activateRoute: ActivatedRoute,
    private someEspecialidadMaquinaria: EspecialidadMaquinariaService,
    private router: Router
  ) {
    this.especialidadmaquinaria = { id: 0 }
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
      this.especialidadmaquinaria.id = this.activateRoute.snapshot.params.id
      this.getEspecialidadMaquinaria(this.especialidadmaquinaria.id)
    }
  }
  getEspecialidadMaquinaria(id: number) {
    this.someEspecialidadMaquinaria.view(id).subscribe({
      next: (especialidadmaquinaria) => {
        this.especialidadmaquinaria = especialidadmaquinaria;
        console.log('especialidadmaquinaria fetched successfully:', this.especialidadmaquinaria);
      },
      error: (error) => {
        console.error('Error fetching especialidadmaquinaria:', error);
      }
    });
  }
  back() {
    this.router.navigate(['especialidad-maquinaria/list'])
  }
  create() {
    this.someEspecialidadMaquinaria.create(this.especialidadmaquinaria).subscribe({
      next: (especialidadmaquinaria) => {
        console.log('especialidadmaquinaria created successfully:', especialidadmaquinaria);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/especialidad-maquinaria/list']); // Redirigir a la lista
        });
      },
      error: (error) => {
        console.error('Error creating especialidadmaquinaria:', error);
        Swal.fire('Error', 'No se pudo crear el registro.', 'error');
      }
    });
  }
  update() {
    this.someEspecialidadMaquinaria.update(this.especialidadmaquinaria).subscribe({
      next: (especialidadmaquinaria) => {
        console.log('especialidadmaquinaria updated successfully:', especialidadmaquinaria);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/especialidad-maquinaria/list']); // Redirigir a la lista
        });
      },
      error: (error) => {
        console.error('Error updating especialidadmaquinaria:', error);
        Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
      }
    });
  }
  delete(id: number) {
    console.log("Delete especialidadmaquinaria with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está especialidadmaquinaria que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someEspecialidadMaquinaria.delete(id).
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
  edit(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }

    this.router.navigate([`/especialidad-maquinaria/update`, id]).then(
      success => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Redirigido',
            text: 'Navegación exitosa al formulario de edición.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo navegar al formulario de edición.'
          });
        }
      },
      error => {
        console.error('Error al navegar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar navegar al formulario de edición.'
        });
      }
    );
  }

}
