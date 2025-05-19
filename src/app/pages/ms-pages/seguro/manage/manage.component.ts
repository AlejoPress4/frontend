import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Seguro } from 'src/app/models/seguro.model';
import { SeguroService } from 'src/app/services/seguroService/seguro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  seguro: Seguro;

  constructor(private activateRoute: ActivatedRoute,
    private someSeguro: SeguroService,
    private router: Router
  ) {
    this.seguro = { id: 0, poliza: [] };
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
      this.seguro.id = this.activateRoute.snapshot.params.id
      this.getSeguro(this.seguro.id)
    }
  }
  getSeguro(id: number) {
    this.someSeguro.view(id).subscribe({
      next: (seguro) => {
        this.seguro = seguro;
        console.log('seguro fetched successfully:', this.seguro);
      },
      error: (error) => {
        console.error('Error fetching seguro:', error);
      }
    });
  }
  back() {
    this.router.navigate(['seguros/list'])
  }
  create() {
    this.someSeguro.create(this.seguro).subscribe({
      next: (seguro) => {
        console.log('seguro created successfully:', seguro);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/seguros/list']);
      },
      error: (error) => {
        console.error('Error creating seguro:', error);
      }
    });
  }
  update() {
    this.someSeguro.update(this.seguro).subscribe({
      next: (seguro) => {
        console.log('seguro updated successfully:', seguro);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/seguros/list']);
      },
      error: (error) => {
        console.error('Error updating seguro:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete seguro with id:", id);
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
        this.someSeguro.delete(id).
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
