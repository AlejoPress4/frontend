import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensaje } from 'src/app/models/mensaje.model';
import { MensajeService } from 'src/app/services/mensajeService/mensaje.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {


  mode: number; //1->View, 2->Create, 3-> Update
  mensaje: Mensaje;

  constructor(private activateRoute: ActivatedRoute,
    private someMensaje: MensajeService,
    private router: Router
  ) {
    this.mensaje = { id: 0 }
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
      this.mensaje.id = this.activateRoute.snapshot.params.id
      this.getMensaje(this.mensaje.id)
    }
  }
  getMensaje(id: number) {
    if (!id) {
      console.error('El ID proporcionado es inválido o undefined:', id);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }
    console.log('Buscando mensaje con ID:', id); // Log para depuración
    this.someMensaje.view(id).subscribe({
      next: (mensaje) => {
        this.mensaje = mensaje;
        console.log('mensaje fetched successfully:', this.mensaje);
      },
      error: (error) => {
        console.error('Error fetching mensaje:', error);
      }
    });
  }
  back() {
    this.router.navigate(['mensaje/list'])
  }
  create() {
    this.someMensaje.create(this.mensaje).subscribe({
      next: (mensaje) => {
        console.log('mensaje created successfully:', mensaje);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/mensaje/list']);
        });
      },
      error: (error) => {
        console.error('Error creating mensaje:', error);
      }
    });
  }
  update() {
    this.someMensaje.update(this.mensaje).subscribe({
      next: (mensaje) => {
        console.log('mensaje updated successfully:', mensaje);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/mensaje/list']);
        });
      },
      error: (error) => {
        console.error('Error updating mensaje:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete mensaje with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está mensaje que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someMensaje.delete(id).
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
