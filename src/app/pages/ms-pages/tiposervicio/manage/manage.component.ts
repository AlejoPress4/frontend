import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoServicio } from 'src/app/models/tipo-servicio.model';
import { TipoServicioService } from 'src/app/services/tipoServicioService/tipo-servicio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  tiposervicio: TipoServicio;
  theFormGroup: FormGroup;

  constructor(
    private activateRoute: ActivatedRoute,
    private someTipoServicio: TipoServicioService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.tiposervicio = { id: 0 };
    this.createForm();
  }

  private createForm(): void {
    this.theFormGroup = this.fb.group({
      id: [{value: 0, disabled: true}],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        // Permitir letras, espacios y guiones para nombres de servicios
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/)
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
        // Permitir una variedad más amplia de caracteres para la descripción
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,():\-]+$/)
      ]]
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
      this.tiposervicio.id = this.activateRoute.snapshot.params.id;
      this.getTipoServicio(this.tiposervicio.id);
    }
  }

  getTipoServicio(id: number) {
    this.someTipoServicio.view(id).subscribe({
      next: (tiposervicio) => {
        this.tiposervicio = tiposervicio;
        this.theFormGroup.patchValue(tiposervicio);
        console.log('Tipo Servicio fetched successfully:', this.tiposervicio);
      },
      error: (error) => {
        console.error('Error fetching Tipo Servicio:', error);
        Swal.fire('Error', 'No se pudo cargar el tipo de servicio.', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['tiposervicio/list']);
  }

  create() {
    if (this.theFormGroup.valid) {
      const tipoServicioData = this.theFormGroup.getRawValue();
      this.someTipoServicio.create(tipoServicioData).subscribe({
        next: (tiposervicio) => {
          console.log('tiposervicio created successfully:', tiposervicio);
          Swal.fire({
            title: 'Creado!',
            text: 'Registro creado correctamente.',
            icon: 'success',
          });
          this.router.navigate(['/tiposervicio/list']);
        },
        error: (error) => {
          console.error('Error creating tiposervicio:', error);
          Swal.fire('Error', 'No se pudo crear el tipo de servicio.', 'error');
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  update() {
    if (this.theFormGroup.valid) {
      const tipoServicioData = { ...this.theFormGroup.getRawValue(), id: this.tiposervicio.id };
      this.someTipoServicio.update(tipoServicioData).subscribe({
        next: (tiposervicio) => {
          console.log('tiposervicio updated successfully:', tiposervicio);
          Swal.fire({
            title: 'Actualizado!',
            text: 'Registro actualizado correctamente.',
            icon: 'success',
          });
          this.router.navigate(['/tiposervicio/list']);
        },
        error: (error) => {
          console.error('Error updating tiposervicio:', error);
          Swal.fire('Error', 'No se pudo actualizar el tipo de servicio.', 'error');
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  delete(id: number) {
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
        this.someTipoServicio.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado!',
              'Registro eliminado correctamente.',
              'success'
            );
            this.router.navigate(['/tiposervicio/list']);
          },
          error: (error) => {
            console.error('Error deleting tiposervicio:', error);
            Swal.fire('Error', 'No se pudo eliminar el tipo de servicio.', 'error');
          }
        });
      }
    });
  }

  // Helper methods for form validation
  private showValidationErrors(): void {
    const fieldLabels = {
      nombre: 'Nombre',
      descripcion: 'Descripción'
    };

    const errorMessages: string[] = [];
    
    Object.keys(this.theFormGroup.controls).forEach(key => {
      const control = this.theFormGroup.get(key);
      const fieldLabel = fieldLabels[key as keyof typeof fieldLabels];
      
      if (control?.errors && (control.dirty || control.touched)) {
        if (control.errors['required']) {
          errorMessages.push(`El campo ${fieldLabel} es requerido`);
        }
        if (control.errors['minlength']) {
          errorMessages.push(`${fieldLabel} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`);
        }
        if (control.errors['maxlength']) {
          errorMessages.push(`${fieldLabel} no debe exceder ${control.errors['maxlength'].requiredLength} caracteres`);
        }
        if (control.errors['pattern']) {
          if (key === 'nombre') {
            errorMessages.push(`${fieldLabel} solo puede contener letras, espacios y guiones`);
          } else if (key === 'descripcion') {
            errorMessages.push(`${fieldLabel} solo puede contener letras, números, espacios y caracteres especiales básicos`);
          }
        }
      }
    });
    
    if (errorMessages.length > 0) {
      Swal.fire({
        title: 'Error de Validación',
        html: errorMessages.join('<br>'),
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  }

  // Helper getter for easy access in template
  get getTheFormGroup() { 
    return this.theFormGroup.controls; 
  }
}
