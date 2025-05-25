import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Servicio } from 'src/app/models/servicio.model';
import { ServicioService } from 'src/app/services/servicioService/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1->View, 2->Create, 3->Update
  servicio: Servicio;
  servicioForm: FormGroup;
  estadosValidos = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'];
  prioridadesValidas = ['Alta', 'Media', 'Baja'];
  tiposValidos = ['Mantenimiento', 'Reparación', 'Instalación', 'Otro'];

  constructor(
    private activateRoute: ActivatedRoute,
    private servicioService: ServicioService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.servicio = { id: 0 };
    this.createForm();
  }

  private createForm(): void {
    this.servicioForm = this.fb.group({
      costo: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+(\.\d{1,2})?$/) // Permite decimales con hasta 2 decimales
      ]],
      f_inicio: ['', [
        Validators.required
      ]],
      f_fin: ['', [
        Validators.required
      ]],
      prioridad: ['', [
        Validators.required,
        Validators.pattern('^(Alta|Media|Baja)$')
      ]],
      tipo: ['', [
        Validators.required,
        Validators.pattern('^(Mantenimiento|Reparación|Instalación|Otro)$')
      ]],
      estado: ['', [
        Validators.required,
        Validators.pattern('^(Pendiente|En Proceso|Completado|Cancelado)$')
      ]],
      ubicacion: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      resumen: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    });

    // Validación de fechas cuando ambas están presentes
    this.servicioForm.valueChanges.subscribe(() => {
      const fInicio = this.servicioForm.get('f_inicio')?.value;
      const fFin = this.servicioForm.get('f_fin')?.value;

      if (fInicio && fFin) {
        if (new Date(fInicio) > new Date(fFin)) {
          this.servicioForm.get('f_fin')?.setErrors({ fechaInvalida: true });
        } else {
          const errors = this.servicioForm.get('f_fin')?.errors;
          if (errors) {
            delete errors['fechaInvalida'];
            if (Object.keys(errors).length === 0) {
              this.servicioForm.get('f_fin')?.setErrors(null);
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
      this.servicioForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.servicio.id = this.activateRoute.snapshot.params.id;
      this.getService(this.servicio.id);
    }
  }

  getService(id: number) {
    this.servicioService.view(id).subscribe({
      next: (service) => {
        this.servicio = service;
        this.servicioForm.patchValue({
          costo: service.costo,
          f_inicio: this.formatDate(service.f_inicio),
          f_fin: this.formatDate(service.f_fin),
          prioridad: service.prioridad,
          tipo: service.tipo,
          estado: service.estado,
          ubicacion: service.ubicacion,
          resumen: service.resumen
        });
        console.log('Service fetched successfully:', this.servicio);
      },
      error: (error) => {
        console.error('Error fetching service:', error);
        Swal.fire('Error', 'No se pudo cargar el servicio', 'error');
      }
    });
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private getFieldLabel(key: string): string {
    const labels: { [key: string]: string } = {
      costo: 'Costo',
      f_inicio: 'Fecha de inicio',
      f_fin: 'Fecha de fin',
      prioridad: 'Prioridad',
      tipo: 'Tipo',
      estado: 'Estado',
      ubicacion: 'Ubicación',
      resumen: 'Resumen'
    };
    return labels[key] || key;
  }

  private showValidationErrors(): void {
    const errorMessages: string[] = [];
    const controls = this.servicioForm.controls;

    for (const [key, control] of Object.entries(controls)) {
      if (control.errors && control.touched) {
        const fieldName = this.getFieldLabel(key);
        
        if (control.errors['required']) {
          errorMessages.push(`El campo ${fieldName} es requerido`);
        }
        if (control.errors['min']) {
          errorMessages.push(`${fieldName} debe ser mayor o igual a ${control.errors['min'].min}`);
        }
        if (control.errors['minlength']) {
          errorMessages.push(`${fieldName} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`);
        }
        if (control.errors['maxlength']) {
          errorMessages.push(`${fieldName} no debe exceder ${control.errors['maxlength'].requiredLength} caracteres`);
        }
        if (control.errors['pattern']) {
          if (key === 'costo') {
            errorMessages.push(`${fieldName} debe ser un número válido con hasta 2 decimales`);
          } else if (['prioridad', 'tipo', 'estado'].includes(key)) {
            errorMessages.push(`${fieldName} no tiene un valor válido`);
          }
        }
        if (control.errors['fechaInvalida']) {
          errorMessages.push('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
    }

    if (errorMessages.length > 0) {
      Swal.fire({
        title: 'Error de Validación',
        html: errorMessages.join('<br>'),
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  create() {
    if (this.servicioForm.invalid) {
      this.markFormGroupTouched(this.servicioForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.servicioForm.value;
    this.servicioService.create(formValue).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/servicios/list']);
        });
      },
      error: (error) => {
        console.error('Error al crear:', error);
        Swal.fire('Error', 'No se pudo crear el servicio', 'error');
      }
    });
  }

  update() {
    if (this.servicioForm.invalid) {
      this.markFormGroupTouched(this.servicioForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.servicioForm.value;
    const payload = {
      ...formValue,
      id: this.servicio.id
    };

    this.servicioService.update(payload).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/servicios/list']);
        });
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        Swal.fire('Error', 'No se pudo actualizar el servicio', 'error');
      }
    });
  }
  back() {
    this.router.navigate(['/servicios/list'])
  }
  delete(id: number) {
    console.log("Delete servicio with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioService.delete(id).
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