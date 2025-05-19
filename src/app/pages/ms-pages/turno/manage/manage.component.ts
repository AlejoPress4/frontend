import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Turno } from 'src/app/models/turno.model';
import { TurnoService } from 'src/app/services/turnoService/turno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  turno: Turno;

  constructor(private activateRoute: ActivatedRoute,
    private someTurno: TurnoService,
    private router: Router
  ) {
    this.turno = { id: 0 }
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
      this.turno.id = this.activateRoute.snapshot.params.id
      this.getTurno(this.turno.id)
    }
  }
  getTurno(id: number) {
    this.someTurno.view(id).subscribe({
      next: (turno) => {
        this.turno = turno;
        console.log('Turno fetched successfully:', this.turno);
      },
      error: (error) => {
        console.error('Error fetching turno:', error);
      }
    });
  }
  back() {
    this.router.navigate(['turnos/list'])
  }
  create() {
    this.someTurno.create(this.turno).subscribe({
      next: (turno) => {
        console.log('turno created successfully:', turno);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/turnos/list']);
      },
      error: (error) => {
        console.error('Error creating turno:', error);
      }
    });
  }
  update() {
    this.someTurno.update(this.turno).subscribe({
      next: (turno) => {
        console.log('turno updated successfully:', turno);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/turnos/list']);
      },
      error: (error) => {
        console.error('Error updating turno:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete turno with id:", id);
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
        this.someTurno.delete(id).
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
