import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  theFormGroup: FormGroup;

  constructor(private activateRoute: ActivatedRoute,
    private someMensaje: MensajeService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.mensaje = { id: 0 };
    this.createForm();
  }

  createForm() {
    this.theFormGroup = this.fb.group({
      contenido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      chat_id: ['', [Validators.required, Validators.min(1)]],
      user_id: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.theFormGroup.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.mensaje.id = this.activateRoute.snapshot.params.id;
      this.getMensaje(this.mensaje.id);
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
    console.log('Buscando mensaje con ID:', id);
    this.someMensaje.view(id).subscribe({
      next: (mensaje) => {
        this.mensaje = mensaje;
        this.theFormGroup.patchValue({
          contenido: mensaje.contenido,
          fecha: mensaje.fecha,
          hora: mensaje.hora,
          chat_id: mensaje.chat_id,
          user_id: mensaje.user_id
        });
        console.log('mensaje fetched successfully:', this.mensaje);
      },
      error: (error) => {
        console.error('Error fetching mensaje:', error);
        Swal.fire('Error', 'No se pudo cargar el mensaje', 'error');
      }
    });
  }

  validateForm(): boolean {
    if (this.theFormGroup.invalid) {
      this.theFormGroup.markAllAsTouched();
      let errorMessage = 'Por favor corrija los siguientes errores:';
      
      for (const field in this.theFormGroup.controls) {
        const control = this.theFormGroup.get(field);
        if (control?.errors) {
          if (control.errors['required']) {
            errorMessage += `\n- El campo ${field} es requerido`;
          }
          if (control.errors['minlength']) {
            errorMessage += `\n- El campo ${field} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
          }
          if (control.errors['maxlength']) {
            errorMessage += `\n- El campo ${field} no debe exceder ${control.errors['maxlength'].requiredLength} caracteres`;
          }
          if (control.errors['min']) {
            errorMessage += `\n- El campo ${field} debe ser mayor que ${control.errors['min'].min}`;
          }
        }
      }
      
      Swal.fire('Error', errorMessage, 'error');
      return false;
    }
    return true;
  }

  back() {
    this.router.navigate(['mensaje/list']);
  }

  create() {
    if (!this.validateForm()) return;

    const mensajeData = {
      ...this.mensaje,
      ...this.theFormGroup.value
    };

    this.someMensaje.create(mensajeData).subscribe({
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
        Swal.fire('Error', 'No se pudo crear el mensaje', 'error');
      }
    });
  }

  update() {
    if (!this.validateForm()) return;

    const mensajeData = {
      ...this.mensaje,
      ...this.theFormGroup.value
    };

    this.someMensaje.update(mensajeData).subscribe({
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
        Swal.fire('Error', 'No se pudo actualizar el mensaje', 'error');
      }
    });
  }

  delete(id: number) {
    console.log("Delete mensaje with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "¿Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someMensaje.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado!',
              'Registro eliminado correctamente.',
              'success'
            );
            this.router.navigate(['/mensaje/list']);
          },
          error: (error) => {
            console.error('Error deleting mensaje:', error);
            Swal.fire('Error', 'No se pudo eliminar el mensaje', 'error');
          }
        });
      }
    });
  }

  // Getters para facilitar la validación en la plantilla
  get contenidoField() {
    return this.theFormGroup.get('contenido');
  }

  get fechaField() {
    return this.theFormGroup.get('fecha');
  }

  get horaField() {
    return this.theFormGroup.get('hora');
  }

  get chatIdField() {
    return this.theFormGroup.get('chat_id');
  }

  get userIdField() {
    return this.theFormGroup.get('user_id');
  }
}
