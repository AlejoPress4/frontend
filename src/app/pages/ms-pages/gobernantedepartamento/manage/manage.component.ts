import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GobernanteDepartamento } from 'src/app/models/gobernante-departamento.model';
import { GobernanteDepartamentoService } from 'src/app/services/gobernanteDepartamentoService/gobernante-departamento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {


  mode: number; //1->View, 2->Create, 3-> Update
  gobernantedepartamento: GobernanteDepartamento;

  constructor(private activateRoute: ActivatedRoute,
    private someGobernanteDepartamento: GobernanteDepartamentoService,
    private router: Router
  ) {
    this.gobernantedepartamento = { id: 0 }
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
      this.gobernantedepartamento.id = this.activateRoute.snapshot.params.id  
      this.getGobernantedepartamento(this.gobernantedepartamento.id)
    }
  }
  getGobernantedepartamento(id: number) {
    this.someGobernanteDepartamento.view(id).subscribe({
      next: (gobernantedepartamento) => {
        this.gobernantedepartamento = gobernantedepartamento;
        console.log('gobernantedepartamento fetched successfully:', this.gobernantedepartamento);
      },
      error: (error) => {
        console.error('Error fetching gobernantedepartamento:', error);
      }
    });
  }
  back() {
    this.router.navigate(['gobernantedepartamento/list'])
  }
  create() {
    this.someGobernanteDepartamento.create(this.gobernantedepartamento).subscribe({
      next: (gobernantedepartamento) => {
        console.log('gobernantedepartamento created successfully:', gobernantedepartamento);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gobernantedepartamento/list']);
      },
      error: (error) => {
        console.error('Error creating gobernantedepartamento:', error);
      }
    });
  }
  update() {
    this.someGobernanteDepartamento.update(this.gobernantedepartamento).subscribe({
      next: (gobernantedepartamento) => {
        console.log('gobernantedepartamento updated successfully:', gobernantedepartamento);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gobernantedepartamento/list']);
      },
      error: (error) => {
        console.error('Error updating gobernantedepartamento:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete gobernantedepartamento with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está gobernantedepartamento que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someGobernanteDepartamento.delete(id).
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
