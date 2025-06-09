import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gobernante } from 'src/app/models/gobernante.model';
import { GobernanteService } from 'src/app/services/gobernanteService/gobernante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {


  mode: number; //1->View, 2->Create, 3-> Update
  gobernante: Gobernante;
  gobernantedepartamentos: any; // Agregué la propiedad para evitar errores en el template

  constructor(private activateRoute: ActivatedRoute,
    private someGobernante: GobernanteService,
    private router: Router
  ) {
    this.gobernante = { id: 0 }
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
      this.gobernante.id = this.activateRoute.snapshot.params.id
      this.getGobernante(this.gobernante.id)
    }
  }
  getGobernante(id: number) {
    this.someGobernante.view(id).subscribe({
      next: (gobernante) => {
        this.gobernante = gobernante;
        console.log('gobernante fetched successfully:', this.gobernante);
      },
      error: (error) => {
        console.error('Error fetching gobernante:', error);
      }
    });
  }
  back() {
    this.router.navigate(['gobernante/list'])
  }
  create() {
    this.someGobernante.create(this.gobernante).subscribe({
      next: (gobernante) => {
        console.log('gobernante created successfully:', gobernante);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gobernante/list']);
      },
      error: (error) => {
        console.error('Error creating gobernante:', error);
      }
    });
  }
  update() {
    this.someGobernante.update(this.gobernante).subscribe({
      next: (gobernante) => {
        console.log('gobernante updated successfully:', gobernante);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gobernante/list']);
      },
      error: (error) => {
        console.error('Error updating gobernante:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete gobernante with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está gobernante que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someGobernante.delete(id).
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
