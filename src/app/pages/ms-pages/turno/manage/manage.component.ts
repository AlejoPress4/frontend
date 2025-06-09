import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Turno } from 'src/app/models/turno.model';
import { TurnoService } from 'src/app/services/turnoService/turno.service';
import { Operario } from 'src/app/models/operario.model';
import { Maquina } from 'src/app/models/maquina.model';
import { OperarioService } from 'src/app/services/operarioService/operario.service';
import { MaquinaService } from 'src/app/services/maquinaService/maquina.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  turno: Turno;
  operarios: Operario[] = [];
  maquinas: Maquina[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private someTurno: TurnoService,
    private router: Router,
    private operarioService: OperarioService,
    private maquinaService: MaquinaService
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
    this.loadOperarios();
    this.loadMaquinas();
  }
  getTurno(id: number) {
    this.someTurno.view(id).subscribe({
      next: (turno) => {
        // Format the fecha field to 'yyyy-MM-dd'
        if (turno.fecha) {
          turno.fecha = turno.fecha.split('T')[0];
        }
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
    // Ensure hora is formatted correctly before sending
    if (this.turno.hora) {
      this.turno.hora = String(this.turno.hora);
    }
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
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo crear el turno. Verifica los datos e inténtalo nuevamente.',
          icon: 'error',
        });
      }
    });
  }
  update() {
    // Ensure fecha and hora are formatted correctly before sending
    if (this.turno.fecha) {
      this.turno.fecha = this.turno.fecha.split('T')[0];
    }
    if (this.turno.hora) {
      this.turno.hora = String(this.turno.hora);
    }

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
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo actualizar el turno. Verifica los datos e inténtalo nuevamente.',
          icon: 'error',
        });
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

  loadOperarios() {
    this.operarioService.list().subscribe({
      next: (operarios) => {
        this.operarios = operarios;
      },
      error: (error) => {
        console.error('Error loading operarios:', error);
      }
    });
  }

  loadMaquinas() {
    this.maquinaService.list().subscribe({
      next: (maquinas) => {
        this.maquinas = maquinas;
      },
      error: (error) => {
        console.error('Error loading maquinas:', error);
      }
    });
  }
}
