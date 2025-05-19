import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Poliza } from 'src/app/models/poliza.model';
import { PolizaService } from 'src/app/services/polizaService/poliza.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  poliza: Poliza;

  constructor(private activateRoute: ActivatedRoute,
    private somePoliza: PolizaService,
    private router: Router
  ) {
    this.poliza = { id: 0 }
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
      this.poliza.id = this.activateRoute.snapshot.params.id
      this.getPoliza(this.poliza.id)
    }
  }
  getPoliza(id: number) {
    this.somePoliza.view(id).subscribe({
      next: (poliza) => {
        this.poliza = poliza;
        console.log('poliza fetched successfully:', this.poliza);
      },
      error: (error) => {
        console.error('Error fetching poliza:', error);
      }
    });
  }
  back() {
    this.router.navigate(['polizas/list'])
  }
  create() {
    this.somePoliza.create(this.poliza).subscribe({
      next: (poliza) => {
        console.log('poliza created successfully:', poliza);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/polizas/list']);
      },
      error: (error) => {
        console.error('Error creating poliza:', error);
      }
    });
  }
  update() {
    this.somePoliza.update(this.poliza).subscribe({
      next: (poliza) => {
        console.log('poliza updated successfully:', poliza);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/polizas/list']);
      },
      error: (error) => {
        console.error('Error updating poliza:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete poliza with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está poliza que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.somePoliza.delete(id).
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
