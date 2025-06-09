import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Combo } from 'src/app/models/combo.model';
import { CombosService } from 'src/app/services/comboService/combos.service';
import { Servicio } from 'src/app/models/servicio.model';
import { ServicioService } from 'src/app/services/servicioService/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; //1->View, 2->Create, 3-> Update
  combo: Combo;
  comboForm: FormGroup;
  servicios: Servicio[] = [];

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private someCombo: CombosService,
    private router: Router,
    private servicioService: ServicioService
  ) {
    this.combo = { id: 0 };
    this.createForm();
  }

  private createForm(): void {
    this.comboForm = this.fb.group({
      servicio_id: ['', [
        Validators.required,
        Validators.min(1)
      ]]
    });
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.comboForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      this.combo.id = this.activateRoute.snapshot.params.id;
      this.getCombo(this.combo.id);
    }

    this.loadServicios();
  }

  loadServicios() {
    this.servicioService.list().subscribe(
      (servicios) => { this.servicios = servicios; },
      (error) => { console.error('Error loading servicios:', error); }
    );
  }

  getCombo(id: number) {
    this.someCombo.view(id).subscribe({
      next: (combo) => {
        this.combo = combo;
        this.comboForm.patchValue({
          servicio_id: combo.servicio_id
        });
        console.log('combo fetched successfully:', this.combo);
      },
      error: (error) => {
        console.error('Error fetching combo:', error);
        Swal.fire('Error', 'No se pudo cargar el combo', 'error');
      }
    });
  }

  private showValidationErrors(): void {
    const errorMessages: string[] = [];
    const control = this.comboForm.get('servicio_id');
    
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        errorMessages.push('El ID del servicio es requerido');
      }
      if (control.errors['min']) {
        errorMessages.push('El ID del servicio debe ser mayor que 0');
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  create() {
    if (this.comboForm.invalid) {
      this.markFormGroupTouched(this.comboForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.comboForm.value;
    this.someCombo.create(formValue).subscribe({
      next: (combo) => {
        console.log('combo created successfully:', combo);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/combos/list']);
        });
      },
      error: (error) => {
        console.error('Error creating combo:', error);
        Swal.fire('Error', 'No se pudo crear el combo', 'error');
      }
    });
  }

  update() {
    if (this.comboForm.invalid) {
      this.markFormGroupTouched(this.comboForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.comboForm.value;
    const payload = {
      ...formValue,
      id: this.combo.id
    };

    this.someCombo.update(payload).subscribe({
      next: (combo) => {
        console.log('combo updated successfully:', combo);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/combos/list']);
        });
      },
      error: (error) => {
        console.error('Error updating combo:', error);
        Swal.fire('Error', 'No se pudo actualizar el combo', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['/combos/list']);
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: "¿Está seguro que quiere eliminar el combo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someCombo.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado!',
              'Registro eliminado correctamente.',
              'success'
            ).then(() => {
              this.router.navigate(['/combos/list']);
            });
          },
          error: (error) => {
            console.error('Error deleting combo:', error);
            Swal.fire('Error', 'No se pudo eliminar el combo', 'error');
          }
        });
      }
    });
  }
}
