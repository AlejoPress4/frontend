import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Especialidad } from 'src/app/models/especialidad.model';
import { EspecialidadesService } from 'src/app/services/especialidadesService/especialidades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1->View, 2->Create, 3->Update
  especialidad: Especialidad;
  theFormGroup: FormGroup;

  constructor(
    private activateRoute: ActivatedRoute,
    private someEspecialidad: EspecialidadesService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.especialidad = { id: 0 };
    this.createForm();
  }

  ngOnInit(): void {
    this.setupMode();
    if (this.activateRoute.snapshot.params.id) {
      this.especialidad.id = this.activateRoute.snapshot.params.id;
      this.getEspecialidad(this.especialidad.id);
    }
  }

  private setupMode(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
  }

  private createForm(): void {
    this.theFormGroup = this.fb.group({
      id: [{value: 0, disabled: true}],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/) // Solo letras, espacios y guiones
      ]]
    });
  }

  // Getter para facilitar el acceso a los controles del formulario en el template
  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showValidationErrors(): void {
    const fieldLabels = {
      nombre: 'Nombre'
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
          errorMessages.push(`${fieldLabel} solo puede contener letras, espacios y guiones`);
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

  getEspecialidad(id: number) {
    this.someEspecialidad.view(id).subscribe({
      next: (especialidad) => {
        this.especialidad = especialidad;
        this.theFormGroup.patchValue(this.especialidad);
        console.log('especialidad fetched successfully:', this.especialidad);
      },
      error: (error) => {
        console.error('Error fetching especialidad:', error);
        Swal.fire('Error', 'No se pudo cargar la especialidad.', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['especialidades/list']);
  }

  create() {
    if (this.theFormGroup.invalid) {
      this.markFormGroupTouched(this.theFormGroup);
      this.showValidationErrors();
      return;
    }

    const especialidad: Especialidad = {
      ...this.theFormGroup.value
    };

    this.someEspecialidad.create(especialidad).subscribe({
      next: (especialidad) => {
        console.log('especialidad created successfully:', especialidad);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/especialidades/list']);
        });
      },
      error: (error) => {
        console.error('Error creating especialidad:', error);
        Swal.fire('Error', 'No se pudo crear el registro.', 'error');
      }
    });
  }

  update() {
    if (this.theFormGroup.invalid) {
      this.markFormGroupTouched(this.theFormGroup);
      this.showValidationErrors();
      return;
    }

    const especialidad: Especialidad = {
      id: this.especialidad.id,
      ...this.theFormGroup.value
    };

    this.someEspecialidad.update(especialidad).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/especialidades/list']);
        });
      },
      error: (error) => {
        console.error('Error al actualizar la especialidad:', error);
        Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
      }
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que quiere eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someEspecialidad.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.router.navigate(['/especialidades/list']);
          },
          error: (error) => {
            console.error('Error al eliminar la especialidad:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}
