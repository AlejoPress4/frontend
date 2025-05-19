import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Operario } from 'src/app/models/operario.model';
import { OperarioService } from 'src/app/services/operarioService/operario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {


  mode: number; //1->View, 2->Create, 3-> Update
  operario: Operario;

  constructor(private activateRoute: ActivatedRoute,
    private someOperario: OperarioService,
    private router: Router
  ) {
    this.operario = { id: 0 }
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
      this.operario.id = this.activateRoute.snapshot.params.id  
      this.getOperario(this.operario.id)
    }
  }
  getOperario(id: number) {
    this.someOperario.view(id).subscribe({
      next: (operario) => {
        this.operario = operario;
        console.log('Operario fetched successfully:', this.operario);
      },
      error: (error) => {
        console.error('Error fetching Operario:', error);
      }
    });
  }
  back() {
    this.router.navigate(['operario/list'])
  }
  create() {
    this.someOperario.create(this.operario).subscribe({
      next: (Operario) => {
        console.log('Operario created successfully:', Operario);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/operario/list']);
      },
      error: (error) => {
        console.error('Error creating Operario:', error);
      }
    });
  }
  update() {
    this.someOperario.update(this.operario).subscribe({
      next: (operario) => {
        console.log('Operario updated successfully:', operario);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/operario/list']);
      },
      error: (error) => {
        console.error('Error updating Operario:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete Operario with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está Operario que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someOperario.delete(id).
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
