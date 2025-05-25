import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Factura } from 'src/app/models/factura.model';
import { FacturaService } from 'src/app/services/facturaService/factura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-factura',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageFacturaComponent implements OnInit {
  mode: number; // 1->View, 2->Create, 3->Update
  factura: Factura;
  theFormGroup: FormGroup;

  constructor(
    private activateRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.factura = { id: 0 };
    this.createForm();
  }

  private createForm(): void {
    this.theFormGroup = this.fb.group({
      id: [{value: 0, disabled: true}],
      detalle: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,():\-]+$/)
      ]],
      id_cuota: ['', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]\d*$/)
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
    
    if (this.activateRoute.snapshot.params['id']) {
      this.factura.id = this.activateRoute.snapshot.params['id'];
      this.getFactura(this.factura.id);
    }
  }

  getFactura(id: number): void {
    this.facturaService.view(id).subscribe({
      next: (factura) => {
        this.factura = factura;
        this.theFormGroup.patchValue(factura);
        console.log('Factura loaded successfully:', this.factura);
      },
      error: (error) => {
        console.error('Error loading factura:', error);
        Swal.fire('Error', 'No se pudo cargar la factura.', 'error');
      }
    });
  }

  back(): void {
    this.router.navigate(['facturas/list']);
  }

  create(): void {
    if (this.theFormGroup.invalid) {
      this.markFormGroupTouched(this.theFormGroup);
      this.showValidationErrors();
      return;
    }

    const facturaData = this.theFormGroup.getRawValue();
    this.facturaService.create(facturaData).subscribe({
      next: (factura) => {
        console.log('Factura created successfully:', factura);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/facturas/list']);
        });
      },
      error: (error) => {
        console.error('Error creating factura:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el registro. Por favor, verifique los datos e intente nuevamente.',
          icon: 'error'
        });
      }
    });
  }

  update(): void {
    if (this.theFormGroup.invalid) {
      this.markFormGroupTouched(this.theFormGroup);
      this.showValidationErrors();
      return;
    }

    const facturaData = { ...this.theFormGroup.getRawValue(), id: this.factura.id };
    this.facturaService.update(facturaData).subscribe({
      next: (factura) => {
        console.log('Factura updated successfully:', factura);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/facturas/list']);
        });
      },
      error: (error) => {
        console.error('Error updating factura:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el registro. Por favor, verifique los datos e intente nuevamente.',
          icon: 'error'
        });
      }
    });
  }

  private getFieldLabel(key: string): string {
    const labels: { [key: string]: string } = {
      detalle: 'Detalle',
      id_cuota: 'ID de cuota'
    };
    return labels[key] || key;
  }

  private showValidationErrors(): void {
    const errorMessages: string[] = [];
    const controls = this.theFormGroup.controls;

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
        if (control.errors['min']) {
          errorMessages.push(`${fieldName} debe ser mayor o igual a ${control.errors['min'].min}`);
        }
        if (control.errors['pattern']) {
          if (key === 'detalle') {
            errorMessages.push(`${fieldName} solo puede contener letras, números, espacios y caracteres especiales básicos`);
          } else if (key === 'id_cuota') {
            errorMessages.push(`${fieldName} debe ser un número entero positivo`);
          }
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
}
