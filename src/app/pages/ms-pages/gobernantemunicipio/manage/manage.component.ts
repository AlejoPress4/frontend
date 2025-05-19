import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GobernanteMunicipio } from 'src/app/models/gobernante-municipio.model';
import { GobernanteMunicipioService } from 'src/app/services/gobernanteMunicipioService/gobernante-municipio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  gobernantemunicipio: GobernanteMunicipio;

  constructor(private activateRoute: ActivatedRoute,
    private someGobernanteMunicipio: GobernanteMunicipioService,
    private router: Router
  ) {
    this.gobernantemunicipio = { id: 0 }
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
      this.gobernantemunicipio.id = this.activateRoute.snapshot.params.id  
      this.getGobernanteMunicipio(this.gobernantemunicipio.id)
    }
  }
  getGobernanteMunicipio(id: number) {
    this.someGobernanteMunicipio.view(id).subscribe({
      next: (gobernantemunicipio) => {
        this.gobernantemunicipio = gobernantemunicipio;
        console.log('gobernantemunicipio fetched successfully:', this.gobernantemunicipio);
      },
      error: (error) => {
        console.error('Error fetching gobernantemunicipio:', error);
      }
    });
  }
  back() {
    this.router.navigate(['gobernantemunicipio/list'])
  }
  create() {
    this.someGobernanteMunicipio.create(this.gobernantemunicipio).subscribe({
      next: (gobernantemunicipio) => {
        console.log('gobernantemunicipio created successfully:', gobernantemunicipio);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gobernantemunicipio/list']);
      },
      error: (error) => {
        console.error('Error creating gobernantemunicipio:', error);
      }
    });
  }
  update() {
    this.someGobernanteMunicipio.update(this.gobernantemunicipio).subscribe({
      next: (gobernantemunicipio) => {
        console.log('gobernantemunicipio updated successfully:', gobernantemunicipio);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gobernantemunicipio/list']);
      },
      error: (error) => {
        console.error('Error updating gobernantemunicipio:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete gobernantemunicipio with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está gobernantemunicipio que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someGobernanteMunicipio.delete(id).
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
