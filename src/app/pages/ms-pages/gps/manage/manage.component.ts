import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GPS } from 'src/app/models/gps.model';
import { GPSService } from 'src/app/services/gpsService/gps.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-gps',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number = 1; // 1 -> Ver, 2 -> Crear, 3 -> Actualizar
  gps: GPS = { id: 0 };
  gpsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private gpsService: GPSService,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.gpsForm = this.fb.group({
      latitud: ['', [
        Validators.required,
        Validators.min(-90),
        Validators.max(90)
      ]],
      longitud: ['', [
        Validators.required,
        Validators.min(-180),
        Validators.max(180)
      ]],
      maquina_id: ['', [
        Validators.required,
        Validators.min(1)
      ]]
    });
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.gpsForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    const idParam = this.activatedRoute.snapshot.params['id'];
    if (idParam) {
      this.gps.id = Number(idParam);
      this.getGPS(this.gps.id);
    }
  }

  getGPS(id: number): void {
    this.gpsService.view(id).subscribe({
      next: (gpsData) => {
        this.gps = gpsData;
        this.gpsForm.patchValue({
          latitud: gpsData.latitud,
          longitud: gpsData.longitud,
          maquina_id: gpsData.maquina_id
        });
        console.log('GPS obtenido exitosamente:', this.gps);
      },
      error: (error) => {
        console.error('Error al obtener el GPS:', error);
        Swal.fire('Error', 'No se pudo cargar el GPS', 'error');
      }
    });
  }

  private showValidationErrors(): void {
    const fieldLabels = {
      latitud: 'Latitud',
      longitud: 'Longitud',
      maquina_id: 'ID de Máquina'
    };

    const errorMessages: string[] = [];
    
    Object.keys(this.gpsForm.controls).forEach(key => {
      const control = this.gpsForm.get(key);
      const fieldLabel = fieldLabels[key as keyof typeof fieldLabels];
      
      if (control?.errors && control.touched) {
        if (control.errors['required']) {
          errorMessages.push(`El campo ${fieldLabel} es requerido`);
        }
        if (control.errors['min']) {
          errorMessages.push(`${fieldLabel} debe ser mayor o igual a ${control.errors['min'].min}`);
        }
        if (control.errors['max']) {
          errorMessages.push(`${fieldLabel} debe ser menor o igual a ${control.errors['max'].max}`);
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  create(): void {
    if (this.gpsForm.invalid) {
      this.markFormGroupTouched(this.gpsForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.gpsForm.value;
    const payload = {
      latitud: formValue.latitud,
      longitud: formValue.longitud,
      maquina_id: formValue.maquina_id
    };

    this.gpsService.create(payload).subscribe({
      next: (createdGPS) => {
        console.log('GPS creado exitosamente:', createdGPS);
        Swal.fire({
          title: '¡Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success'
        }).then(() => this.router.navigate(['/gps/list']));
      },
      error: (error) => {
        console.error('Error al crear el GPS:', error);
        Swal.fire('Error', 'No se pudo crear el GPS', 'error');
      }
    });
  }

  update(): void {
    if (this.gpsForm.invalid) {
      this.markFormGroupTouched(this.gpsForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.gpsForm.value;
    const payload = {
      id: this.gps.id,
      latitud: formValue.latitud,
      longitud: formValue.longitud,
      maquina_id: formValue.maquina_id
    };

    this.gpsService.update(payload).subscribe({
      next: (updatedGPS) => {
        console.log('GPS actualizado exitosamente:', updatedGPS);
        Swal.fire({
          title: '¡Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => this.router.navigate(['/gps/list']));
      },
      error: (error) => {
        console.error('Error al actualizar el GPS:', error);
        Swal.fire('Error', 'No se pudo actualizar el GPS', 'error');
      }
    });
  }

  back(): void {
    this.router.navigate(['/gps/list']);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: "¿Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gpsService.delete(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'Registro eliminado correctamente.',
            'success'
          );
          this.router.navigate(['/gps/list']);
        });
      }
    });
  }
}
