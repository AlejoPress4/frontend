import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cuotas } from 'src/app/models/cuotas.model';
import { CuotasService } from 'src/app/services/cuotasService/cuotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1->View, 2->Create, 3->Update
  cuota: Cuotas;
  cuotaForm: FormGroup;
  paymentData = {
    card: {
      number: '',
      exp_year: '',
      exp_month: '',
      cvc: ''
    },
    customer: {
      name: '',
      last_name: '',
      email: '',
      phone: '',
      doc_number: ''
    },
    due: {
      id: '',
      id_servicio: '',
      valor: ''
    },
    description: '',
    tax: '',
    tax_base: '',
    dues: ''
  };
  constructor(
    private activateRoute: ActivatedRoute,
    private cuotasService: CuotasService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.cuota = { id: 0 };
    this.createForm();
  }

  private createForm(): void {
    this.cuotaForm = this.fb.group({
      id_servicio: ['', [
        Validators.required,
        Validators.min(1)
      ]],      valor: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+([.][0-9]{0,2})?$/) // Permite decimales con hasta 2 decimales, más flexible
      ]]
    });
  }
  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.cuotaForm.disable(); // Deshabilitar el formulario en modo vista
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.cuotaForm.enable(); // Asegurarse de que el formulario esté habilitado
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
      this.cuotaForm.enable(); // Asegurarse de que el formulario esté habilitado
    }
    
    const id = this.activateRoute.snapshot.params['id'];
    if (id) {
      this.cuota.id = Number(id);
      this.getCuota(this.cuota.id);
    }
  }getCuota(id: number) {    
    this.cuotasService.view(id).subscribe({
      next: (cuota) => {
        // Set the main model
        this.cuota = cuota;
        
        // Patch form values
        this.cuotaForm.patchValue({
          id_servicio: cuota.id_servicio,
          valor: cuota.valor
        });

        // Sincronizar con paymentData para mantener compatibilidad
        this.paymentData.due = {
          id: cuota.id?.toString() || '',
          valor: cuota.valor?.toString() || '',
          id_servicio: cuota.id_servicio?.toString() || ''
        };
        
        if (this.mode === 1) { // View mode
          this.cuotaForm.disable();
        } else {
          // Suscribirse a los cambios del formulario para mantener paymentData sincronizado
          this.cuotaForm.valueChanges.subscribe(values => {
            this.paymentData.due.valor = values.valor?.toString() || '';
            this.paymentData.due.id_servicio = values.id_servicio?.toString() || '';
          });
        }
        
        console.log('Cuota fetched and synchronized:', {
          cuota: this.cuota,
          formData: this.cuotaForm.value,
          paymentData: this.paymentData.due
        });
      },
      error: (error) => {
        console.error('Error fetching cuota:', error);
        Swal.fire('Error', 'No se pudo cargar la información de la cuota.', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['/cuotas/list']);
  }
  create() {
    if (this.cuotaForm.invalid) {
      this.markFormGroupTouched(this.cuotaForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.cuotaForm.value;
    const newCuota: Cuotas = {
      id_servicio: Number(formValue.id_servicio),
      valor: Number(formValue.valor)
    };

    this.cuotasService.create(newCuota).subscribe({
      next: (cuota) => {
        console.log('Cuota created successfully:', cuota);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/cuotas/list']);
        });
      },
      error: (error) => {
        console.error('Error creating cuota:', error);
        Swal.fire('Error', 'No se pudo crear la cuota', 'error');
      }
    });
  }

  // Getters para facilitar el acceso en el template
  get f() {
    return this.cuotaForm.controls;
  }

  private showValidationErrors(): void {
    const errorMessages: string[] = [];
    const controls = this.cuotaForm.controls;

    for (const [key, control] of Object.entries(controls)) {
      if (control.errors && control.touched) {
        const fieldName = this.getFieldLabel(key);
        
        if (control.errors['required']) {
          errorMessages.push(`El campo ${fieldName} es requerido`);
        }
        if (control.errors['min']) {
          errorMessages.push(`${fieldName} debe ser mayor o igual a ${control.errors['min'].min}`);
        }
        if (control.errors['pattern']) {
          if (key === 'valor') {
            errorMessages.push(`${fieldName} debe ser un número válido con hasta 2 decimales`);
          } else {
            errorMessages.push(`${fieldName} no tiene un valor válido`);
          }
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
      'id_servicio': 'ID del Servicio',
      'valor': 'Valor'
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
  updateCuota(field: string, value: any) {
    // Actualiza el modelo cuota cuando cambian los valores en el formulario
    if (field === 'id_servicio') {
      this.cuota.id_servicio = Number(value);
    } else if (field === 'valor') {
      this.cuota.valor = Number(value);
    }
  }  update() {
    if (this.cuotaForm.invalid) {
      this.markFormGroupTouched(this.cuotaForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.cuotaForm.value;
    const updatedCuota: Cuotas = {
      id: this.cuota.id,
      id_servicio: Number(formValue.id_servicio),
      valor: Number(formValue.valor)
    };

    this.cuotasService.update(updatedCuota).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/cuotas/list']);
        });
      },
      error: (error) => {
        console.error('Error al actualizar la cuota:', error);
        Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
      }
    });
  }

  delete(id: number) {
    console.log('Delete cuota with id:', id);
    Swal.fire({
      title: 'Eliminar',
      text: 'Está seguro que quiere eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuotasService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit();
          },
          error: (error) => {
            console.error('Error deleting cuota:', error);
          }
        });
      }
    });
  }

  pay() {
    this.cuotasService.pay(this.paymentData).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Pago procesado exitosamente.', 'success');
        console.log('Payment response:', response);
      },
      error: (error) => {
        Swal.fire('Error', 'Hubo un problema al procesar el pago.', 'error');
        console.error('Payment error:', error);
      }
    });
  }
}
