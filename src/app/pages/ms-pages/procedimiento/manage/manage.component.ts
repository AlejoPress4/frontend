import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Procedimiento } from 'src/app/models/procedimiento.model';
import { ProcedimientoService } from 'src/app/services/procedimientoService/procedimiento.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  procedimiento: Procedimiento;
  theFormGroup: FormGroup;

  constructor(private activateRoute: ActivatedRoute,
    private someProcedimiento: ProcedimientoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.procedimiento = { id: 0 };
    this.theFormGroup = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      // mantenimientos: ['', []] // Si quieres validar mantenimientos, ajusta aquí
    });
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.procedimiento.id = this.activateRoute.snapshot.params.id  
      this.getProcedimiento(this.procedimiento.id)
    }
    if (this.mode === 1 || this.mode === 3) {
      this.theFormGroup.patchValue(this.procedimiento);
    }
  }
  getProcedimiento(id: number) {
    this.someProcedimiento.view(id).subscribe({
      next: (procedimiento) => {
        this.procedimiento = procedimiento;
        console.log('procedimiento fetched successfully:', this.procedimiento);
      },
      error: (error) => {
        console.error('Error fetching procedimiento:', error);
      }
    });
  }
  back() {
    this.router.navigate(['procedimiento/list'])
  }
  create() {
    if (this.theFormGroup.invalid) {
      this.theFormGroup.markAllAsTouched();
      Swal.fire("Error", "Por favor llene correctamente los campos", "error");
      return;
    }
    const payload = this.theFormGroup.value;
    this.someProcedimiento.create(payload).subscribe({
      next: (procedimiento) => {
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/procedimiento/list']);
        });
      },
      error: (error) => {
        console.error('Error creating procedimiento:', error);
      }
    });
  }
  update() {
    if (this.theFormGroup.invalid) {
      this.theFormGroup.markAllAsTouched();
      Swal.fire("Error", "Por favor llene correctamente los campos", "error");
      return;
    }
    const payload = { ...this.procedimiento, ...this.theFormGroup.value };
    this.someProcedimiento.update(payload).subscribe({
      next: (procedimiento) => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/procedimiento/list']);
        });
      },
      error: (error) => {
        console.error('Error updating procedimiento:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete procedimiento with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está procedimiento que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someProcedimiento.delete(id).
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
  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

}
