import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Maquina } from 'src/app/models/maquina.model';
import { MaquinaService } from 'src/app/services/maquinaService/maquina.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; //1->View, 2->Create, 3-> Update
  maquina: Maquina;
  maquinaForm: FormGroup;

  // Estados y disponibilidad válidos
  estadosValidos = ['Activo', 'Inactivo', 'En Mantenimiento', 'Fuera de Servicio'];
  disponibilidadOpciones = [
    { value: true, label: 'Disponible' },
    { value: false, label: 'No Disponible' }
  ];

  constructor(
    private activateRoute: ActivatedRoute,
    private someMaquina: MaquinaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.maquina = { id: 0 };
    this.createForm();
  }

  private createForm(): void {
    this.maquinaForm = this.fb.group({
      especialidad: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      marca: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]],
      modelo: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]],
      estado: ['', [
        Validators.required,
        Validators.pattern('^(Activo|Inactivo|En Mantenimiento|Fuera de Servicio)$')
      ]],
      ubicacion: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      disponibilidad: [true, [Validators.required]],
      fecha_asignacion: [null],
      fecha_retiro: [null]
    });

    // Validación de fechas cuando ambas están presentes
    this.maquinaForm.valueChanges.subscribe(() => {
      const fechaAsignacion = this.maquinaForm.get('fecha_asignacion')?.value;
      const fechaRetiro = this.maquinaForm.get('fecha_retiro')?.value;

      if (fechaAsignacion && fechaRetiro) {
        if (new Date(fechaAsignacion) > new Date(fechaRetiro)) {
          this.maquinaForm.get('fecha_retiro')?.setErrors({ fechaInvalida: true });
        } else {
          const errors = this.maquinaForm.get('fecha_retiro')?.errors;
          if (errors) {
            delete errors['fechaInvalida'];
            if (Object.keys(errors).length === 0) {
              this.maquinaForm.get('fecha_retiro')?.setErrors(null);
            }
          }
        }
      }
    });
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.maquinaForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      this.maquina.id = this.activateRoute.snapshot.params.id;
      this.getMaquinaAndPatchForm(this.maquina.id);
    }
  }

  getMaquinaAndPatchForm(id: number) {
    this.someMaquina.view(id).subscribe({
      next: (maquina) => {
        this.maquina = maquina;
        this.maquinaForm.patchValue(this.maquina);
        console.log('maquina fetched and form patched:', this.maquina);
      },
      error: (error) => {
        console.error('Error fetching maquina:', error);
      }
    });
  }

  back() {
    this.router.navigate(['maquinas/list'])
  }
  create() {
    if (this.maquinaForm.invalid) {
      this.markFormGroupTouched(this.maquinaForm);
      this.showValidationErrors();
      return;
    }

    const payload = this.maquinaForm.value;
    console.log('Payload enviado al backend:', payload);
    this.someMaquina.create(payload).subscribe({
      next: (maquina) => {
        console.log('Máquina creada exitosamente:', maquina);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/maquinas/list']);
        });
      },
      error: (error) => {
        console.error('Error creating maquina:', error);
        Swal.fire('Error', 'No se pudo crear la máquina', 'error');
      }
    });
  }
  update() {
    if (this.maquinaForm.invalid) {
      this.markFormGroupTouched(this.maquinaForm);
      this.showValidationErrors();
      return;
    }

    const payload = { 
      ...this.maquinaForm.value,
      id: this.maquina.id
    };

    this.someMaquina.update(payload).subscribe({
      next: (maquina) => {
        console.log('Máquina actualizada exitosamente:', maquina);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/maquinas/list']);
        });
      },
      error: (error) => {
        console.error('Error updating maquina:', error);
        Swal.fire('Error', 'No se pudo actualizar la máquina', 'error');
      }
    });
  }
  delete(id: number) {
    console.log("Delete maquina with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está maquina que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someMaquina.delete(id).
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

  private showValidationErrors(): void {
    const errorMessages: string[] = [];
    const controls = this.maquinaForm.controls;

    for (const [key, control] of Object.entries(controls)) {
      if (control.errors && control.touched) {
        const fieldName = this.getFieldLabel(key);
        
        if (control.errors['required']) {
          errorMessages.push(`El campo ${fieldName} es requerido`);
        }
        if (control.errors['minlength']) {
          errorMessages.push(`${fieldName} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`);
        }
        if (control.errors['maxlength']) {
          errorMessages.push(`${fieldName} no debe exceder ${control.errors['maxlength'].requiredLength} caracteres`);
        }
        if (control.errors['pattern'] && key === 'estado') {
          errorMessages.push(`${fieldName} debe ser uno de los siguientes: ${this.estadosValidos.join(', ')}`);
        }
        if (control.errors['fechaInvalida']) {
          errorMessages.push('La fecha de retiro debe ser posterior a la fecha de asignación');
        }
      }
    }

    if (errorMessages.length > 0) {
      Swal.fire({
        title: 'Error de Validación',
        html: errorMessages.join('<br>'),
        icon: 'error'
      });
    }
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      especialidad: 'Especialidad',
      marca: 'Marca',
      modelo: 'Modelo',
      estado: 'Estado',
      ubicacion: 'Ubicación',
      disponibilidad: 'Disponibilidad',
      fecha_asignacion: 'Fecha de asignación',
      fecha_retiro: 'Fecha de retiro'
    };
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper getter for easy access in template
  get getTheFormGroup() {
    return this.maquinaForm.controls;
  }

}
