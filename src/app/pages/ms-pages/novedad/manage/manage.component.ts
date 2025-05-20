import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Novedad } from 'src/app/models/novedad.model';
import { NovedadService } from 'src/app/services/novedadService/novedad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  public mode: number; //1->View, 2->Create, 3-> Update
  public novedadForm: FormGroup;
  public novedad: Novedad = {} as Novedad;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private novedadService: NovedadService,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.novedadForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      tipo: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      gravedad: ['', [
        Validators.required,
        Validators.pattern('^(Alta|Media|Baja)$')
      ]],
      turno_id: [null, [
        Validators.required,
        Validators.min(1)
      ]]
    });
  }

  ngOnInit(): void {
    this.setupMode();
  }

  private setupMode(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.novedadForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    const id = this.activateRoute.snapshot.params.id;
    if (id) {
      this.loadNovedad(id);
    }
  }

  private loadNovedad(id: number): void {
    this.novedadService.view(id).subscribe({
      next: (data) => {
        this.novedad = data;
        this.novedadForm.patchValue(data);
      },
      error: (error) => {
        console.error('Error al cargar la novedad:', error);
        Swal.fire('Error', 'No se pudo cargar la novedad', 'error');
        this.router.navigate(['/novedades/list']);
      }
    });
  }

  private showValidationErrors(): void {
    const fieldLabels: Record<string, string> = {
      tipo: 'Tipo de novedad',
      descripcion: 'Descripción',
      gravedad: 'Gravedad',
      turno_id: 'Turno'
    };

    const errorMessages: string[] = [];
    
    Object.keys(this.novedadForm.controls).forEach(key => {
      const control = this.novedadForm.get(key);
      const fieldLabel = fieldLabels[key] || key;
      
      if (control?.errors && control.touched) {
        if (control.errors['required']) {
          errorMessages.push(`El campo ${fieldLabel} es requerido`);
        }
        if (control.errors['minlength']) {
          errorMessages.push(`${fieldLabel} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`);
        }
        if (control.errors['maxlength']) {
          errorMessages.push(`${fieldLabel} no debe exceder ${control.errors['maxlength'].requiredLength} caracteres`);
        }
        if (control.errors['min']) {
          errorMessages.push(`${fieldLabel} debe ser mayor que ${control.errors['min'].min}`);
        }
        if (control.errors['pattern'] && key === 'gravedad') {
          errorMessages.push(`${fieldLabel} debe ser Alta, Media o Baja`);
        }
      }
    });
    
    if (errorMessages.length > 0) {
      const message = errorMessages.join('\n');
      Swal.fire({
        title: 'Error de Validación',
        html: message.replace(/\n/g, '<br>'),
        icon: 'error'
      });
    }
  }

  public create(): void {
    if (this.novedadForm.invalid) {
      this.markFormGroupTouched(this.novedadForm);
      this.showValidationErrors();
      return;
    }

    const novedad: Novedad = this.novedadForm.getRawValue();
    this.createNovedad(novedad);
  }

  public update(): void {
    if (this.novedadForm.invalid) {
      this.markFormGroupTouched(this.novedadForm);
      this.showValidationErrors();
      return;
    }

    const novedad: Novedad = {
      ...this.novedadForm.getRawValue(),
      id: this.novedad.id
    };
    this.updateNovedad(novedad);
  }

  public delete(id: number): void {
    if (!id) return;

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.novedadService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Novedad eliminada exitosamente', 'success')
              .then(() => this.router.navigate(['/novedades/list']));
          },
          error: (error) => {
            console.error('Error al eliminar la novedad:', error);
            Swal.fire('Error', 'No se pudo eliminar la novedad', 'error');
          }
        });
      }
    });
  }

  public back(): void {
    this.router.navigate(['/novedades/list']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private createNovedad(novedad: Novedad): void {
    this.novedadService.create(novedad).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado!',
          text: 'Novedad creada exitosamente',
          icon: 'success'
        }).then(() => this.router.navigate(['/novedades/list']));
      },
      error: (error) => {
        console.error('Error al crear la novedad:', error);
        Swal.fire('Error', 'No se pudo crear la novedad', 'error');
      }
    });
  }

  private updateNovedad(novedad: Novedad): void {
    this.novedadService.update(novedad).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Novedad actualizada exitosamente',
          icon: 'success'
        }).then(() => this.router.navigate(['/novedades/list']));
      },
      error: (error) => {
        console.error('Error al actualizar la novedad:', error);
        Swal.fire('Error', 'No se pudo actualizar la novedad', 'error');
      }
    });
  }

  // Getters para el template
  get tipoField() { return this.novedadForm.get('tipo'); }
  get descripcionField() { return this.novedadForm.get('descripcion'); }
  get gravedadField() { return this.novedadForm.get('gravedad'); }
  get turnoIdField() { return this.novedadForm.get('turno_id'); }
}
