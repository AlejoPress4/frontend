import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seguro } from 'src/app/models/seguro.model';
import { SeguroService } from 'src/app/services/seguroService/seguro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; //1->View, 2->Create, 3-> Update
  seguro: Seguro;
  seguroForm: FormGroup;

  constructor(
    private activateRoute: ActivatedRoute,
    private someSeguro: SeguroService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.seguro = { id: 0 };
    this.initForm();
  }

  private initForm(): void {
    this.seguroForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFieldError(field: string): string | null {
    const control = this.seguroForm.get(field);
    if (!control?.touched) return null;
    
    if (control.errors?.required) return 'Este campo es requerido';
    if (control.errors?.minlength) {
      const minLength = control.errors.minlength.requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    if (control.errors?.maxlength) {
      const maxLength = control.errors.maxlength.requiredLength;
      return `No debe exceder ${maxLength} caracteres`;
    }
    return null;
  }
  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.seguroForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.seguro.id = this.activateRoute.snapshot.params.id;
      this.getSeguro(this.seguro.id);
    }
  }  getSeguro(id: number) {
    this.someSeguro.view(id).subscribe({
      next: (seguro) => {
        this.seguro = seguro;
        this.seguroForm.patchValue(seguro);
        console.log('seguro fetched successfully:', this.seguro);
      },
      error: (error) => {
        console.error('Error fetching seguro:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al obtener el seguro.',
          icon: 'error'
        });
      }
    });
  }

  back() {
    this.router.navigate(['seguros/list']);
  }

  create() {
    if (this.seguroForm.invalid) {
      this.markFormGroupTouched(this.seguroForm);
      Swal.fire({
        title: 'Error!',
        text: 'Por favor complete todos los campos requeridos correctamente.',
        icon: 'error'
      });
      return;
    }

    const formValue = this.seguroForm.value;
    this.seguro = { ...this.seguro, ...formValue };

    this.someSeguro.create(this.seguro).subscribe({
      next: (seguro) => {
        console.log('seguro created successfully:', seguro);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/seguros/list']);
      },
      error: (error) => {
        console.error('Error creating seguro:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al crear el seguro.',
          icon: 'error'
        });
      }
    });
  }

  update() {
    if (this.seguroForm.invalid) {
      this.markFormGroupTouched(this.seguroForm);
      Swal.fire({
        title: 'Error!',
        text: 'Por favor complete todos los campos requeridos correctamente.',
        icon: 'error'
      });
      return;
    }

    const formValue = this.seguroForm.value;
    this.seguro = { ...this.seguro, ...formValue };

    this.someSeguro.update(this.seguro).subscribe({
      next: (seguro) => {
        console.log('seguro updated successfully:', seguro);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/seguros/list']);
      },
      error: (error) => {
        console.error('Error updating seguro:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el seguro.',
          icon: 'error'
        });
      }
    });
  }
  delete(id: number) {
    console.log("Delete seguro with id:", id);
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
        this.someSeguro.delete(id).
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
