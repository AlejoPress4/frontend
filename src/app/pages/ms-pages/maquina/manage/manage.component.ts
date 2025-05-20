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
  theFormGroup: FormGroup;

  constructor(private activateRoute: ActivatedRoute,
    private someMaquina: MaquinaService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.maquina = {
      id: 0
    };
    this.theFormGroup = this.fb.group({
      especialidad: ['', [Validators.required, Validators.minLength(3)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      estado: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      disponibilidad: ['', [Validators.required]],
      fecha_asignacion: [null],
      fecha_retiro: [null]
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
      this.maquina.id = this.activateRoute.snapshot.params.id
      this.getMaquinaAndPatchForm(this.maquina.id);
    }
  }

  getMaquinaAndPatchForm(id: number) {
    this.someMaquina.view(id).subscribe({
      next: (maquina) => {
        this.maquina = maquina;
        this.theFormGroup.patchValue(this.maquina);
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
    if (this.theFormGroup.invalid) {
      this.theFormGroup.markAllAsTouched();
      Swal.fire("Error", "Por favor llene correctamente los campos", "error");
      return;
    }
    const payload = this.theFormGroup.value;
    console.log('Payload enviado al backend:', payload); // Log para depuración
    this.someMaquina.create(payload).subscribe({
      next: (maquina) => {
        console.log('maquina created successfully:', maquina);
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
        if (error.status === 422) {
          console.error('Errores de validación:', error.error.errors);
        }
      }
    });
  }
  update() {
    if (this.theFormGroup.invalid) {
      this.theFormGroup.markAllAsTouched();
      Swal.fire("Error", "Por favor llene correctamente los campos", "error");
      return;
    }
    const payload = { ...this.maquina, ...this.theFormGroup.value };
    this.someMaquina.update(payload).subscribe({
      next: (maquina) => {
        console.log('maquina updated successfully:', maquina);
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

  // Helper getter for easy access in template
  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

}
