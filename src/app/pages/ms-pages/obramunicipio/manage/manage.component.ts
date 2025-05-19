import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObraMunicipio } from 'src/app/models/obra-municipio.model';
import { ObraMunicipioService } from 'src/app/services/obraMunicipioService/obra-municipio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {



  mode: number; //1->View, 2->Create, 3-> Update
  obramunicipio: ObraMunicipio;

  constructor(private activateRoute: ActivatedRoute,
    private someObraMunicipio: ObraMunicipioService,
    private router: Router
  ) {
    this.obramunicipio = { id: 0 }
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
      this.obramunicipio.id = this.activateRoute.snapshot.params.id  
      this.getObraMunicipio(this.obramunicipio.id)
    }
  }
  getObraMunicipio(id: number) {
    this.someObraMunicipio.view(id).subscribe({
      next: (obramunicipio) => {
        this.obramunicipio = obramunicipio;
        console.log('obramunicipio fetched successfully:', this.obramunicipio);
      },
      error: (error) => {
        console.error('Error fetching obramunicipio:', error);
      }
    });
  }
  back() {
    this.router.navigate(['obramunicipio/list'])
  }
  create() {
    this.someObraMunicipio.create(this.obramunicipio).subscribe({
      next: (obramunicipio) => {
        console.log('obramunicipio created successfully:', obramunicipio);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/obramunicipio/list']);
      },
      error: (error) => {
        console.error('Error creating obramunicipio:', error);
      }
    });
  }
  update() {
    this.someObraMunicipio.update(this.obramunicipio).subscribe({
      next: (obramunicipio) => {
        console.log('obramunicipio updated successfully:', obramunicipio);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/obramunicipio/list']);
      },
      error: (error) => {
        console.error('Error updating obramunicipio:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete obramunicipio with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está obramunicipio que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someObraMunicipio.delete(id).
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
