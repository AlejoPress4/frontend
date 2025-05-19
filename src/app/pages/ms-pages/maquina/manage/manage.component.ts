import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Maquina } from 'src/app/models/maquina.model';
import { MaquinaService } from 'src/app/services/maquinaService/maquina.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  maquina: Maquina;

  constructor(private activateRoute: ActivatedRoute,
    private someMaquina: MaquinaService,
    private router: Router
  ) {
    this.maquina = {
      id: 0,
      operarios: [], // Default value for operarios
      mantenimientos: [], // Default value for mantenimientos
      seguros: [] // Default value for seguros
    };
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
      this.maquina.id = this.activateRoute.snapshot.params.id
      this.getMaquina(this.maquina.id)
    }
  }
  getMaquina(id: number) {
    this.someMaquina.view(id).subscribe({
      next: (maquina) => {
        this.maquina = maquina;
        console.log('maquina fetched successfully:', this.maquina);
      },
      error: (error) => {
        console.error('Error fetching maquina:', error);
      }
    });
  }
  back() {
    this.router.navigate(['maquina/list'])
  }
  create() {
    this.someMaquina.create(this.maquina).subscribe({
      next: (maquina) => {
        console.log('maquina created successfully:', maquina);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/maquina/list']);
      },
      error: (error) => {
        console.error('Error creating maquina:', error);
      }
    });
  }
  update() {
    this.someMaquina.update(this.maquina).subscribe({
      next: (maquina) => {
        console.log('maquina updated successfully:', maquina);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/maquina/list']);
      },
      error: (error) => {
        console.error('Error updating maquina:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete maquina with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está maquina que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someMaquina.delete(id).
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
