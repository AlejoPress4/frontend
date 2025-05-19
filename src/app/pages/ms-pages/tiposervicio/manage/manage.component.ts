import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoServicio } from 'src/app/models/tipo-servicio.model';
import { TipoServicioService } from 'src/app/services/tipoServicioService/tipo-servicio.service';
import { SeguroService } from 'src/app/services/seguroService/seguro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  tiposervicio: TipoServicio;

  constructor(private activateRoute: ActivatedRoute,
    private someTipoServicio: TipoServicioService,
    private router: Router
  ) {
    this.tiposervicio = { id: 0 };
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
      this.tiposervicio.id = this.activateRoute.snapshot.params.id
      this.getTipoServicio(this.tiposervicio.id)
    }
  }
  getTipoServicio(id: number) {
    this.someTipoServicio.view(id).subscribe({
      next: (tiposervicio) => {
        this.tiposervicio = tiposervicio;
        console.log('Turno fetched successfully:', this.tiposervicio);
      },
      error: (error) => {
        console.error('Error fetching Turno:', error);
      }
    });
  }
  back() {
    this.router.navigate(['tiposervicio/list'])
  }
  create() {
    this.someTipoServicio.create(this.tiposervicio).subscribe({
      next: (tiposervicio) => {
        console.log('tiposervicio created successfully:', tiposervicio);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/tiposervicio/list']);
      },
      error: (error) => {
        console.error('Error creating tiposervicio:', error);
      }
    });
  }
  update() {
    this.someTipoServicio.update(this.tiposervicio).subscribe({
      next: (tiposervicio) => {
        console.log('tiposervicio updated successfully:', tiposervicio);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/tiposervicio/list']);
      },
      error: (error) => {
        console.error('Error updating tiposervicio:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete tiposervicio with id:", id);
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
        this.someTipoServicio.delete(id).
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
