import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mantenimiento } from 'src/app/models/mantenimiento.model';
import { MantenimientoService } from 'src/app/services/mantenimientoService/mantenimiento.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1; // 1 -> Ver, 2 -> Crear, 3 -> Actualizar
  mantenimiento: Mantenimiento = { id: 0 };
  theFormGroup: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mantenimientoService: MantenimientoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.theFormGroup = this.fb.group({
      fecha: ['', Validators.required],
      estado: ['', [Validators.required, Validators.minLength(3)]],
      maquina_id: [null, Validators.required],
      responsable: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    const idParam = this.activatedRoute.snapshot.params['id'];
    if (idParam) {
      this.mantenimiento.id = Number(idParam);
      this.getMantenimiento(this.mantenimiento.id);
    }
  }

  getMantenimiento(id: number): void {
    this.mantenimientoService.view(id).subscribe({
      next: (mantenimientoData) => {
        this.mantenimiento = mantenimientoData;
        this.theFormGroup.patchValue(this.mantenimiento);
        console.log('Mantenimiento obtenido exitosamente:', this.mantenimiento);
      },
      error: (error) => {
        console.error('Error al obtener el mantenimiento:', error);
      }
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  back(): void {
    this.router.navigate(['/mantenimientos/list']);
  }

  create(): void {
    if (this.theFormGroup.invalid) {
      this.theFormGroup.markAllAsTouched();
      Swal.fire('Error', 'Por favor llene correctamente los campos', 'error');
      return;
    }
    const payload = { ...this.mantenimiento, ...this.theFormGroup.value };
    console.log('Payload enviado al backend:', payload); // Log para depuración
    this.mantenimientoService.create(payload).subscribe({
      next: (createdMantenimiento) => {
        console.log('Mantenimiento creado exitosamente:', createdMantenimiento);
        Swal.fire({
          title: '¡Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success'
        });
        this.router.navigate(['/mantenimientos/list']);
      },
      error: (error) => {
        console.error('Error al crear el mantenimiento:', error);
      }
    });
  }

  update(): void {
    if (this.theFormGroup.invalid) {
      this.theFormGroup.markAllAsTouched();
      Swal.fire('Error', 'Por favor llene correctamente los campos', 'error');
      return;
    }
    const payload = { ...this.mantenimiento, ...this.theFormGroup.value };
    this.mantenimientoService.update(payload).subscribe({
      next: (updatedMantenimiento) => {
        console.log('Mantenimiento actualizado exitosamente:', updatedMantenimiento);
        Swal.fire({
          title: '¡Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        });
        this.router.navigate(['/mantenimientos/list']);
      },
      error: (error) => {
        console.error('Error al actualizar el mantenimiento:', error);
      }
    });
  }

  delete(id: number): void {
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
        this.mantenimientoService.delete(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'Registro eliminado correctamente.',
            'success'
          );
          this.router.navigate(['/mantenimientos/list']);
        });
      }
    });
  }
}
