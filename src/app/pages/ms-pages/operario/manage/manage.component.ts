import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Operario } from 'src/app/models/operario.model';
import { OperarioService } from 'src/app/services/operarioService/operario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuarioService/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; //1->View, 2->Create, 3-> Update
  operario: Operario;
  operarioForm: FormGroup;
  usuarios: Usuario[] = []; // Arreglo para almacenar los usuarios

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private someOperario: OperarioService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.operario = { id: 0 };
    this.createForm();
  }

  private createForm(): void {
    this.operarioForm = this.fb.group({
      user_id: ['', [
        Validators.required,
        Validators.minLength(1)
      ]],
      experiencia: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      periodoInit: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
      ]],
      periodoEnd: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
      ]]
    });
  }

  ngOnInit(): void {
    this.usuarioService.list().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
    this.setupMode();
  }

  private setupMode(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.operarioForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      this.operario.id = this.activateRoute.snapshot.params.id;
      this.getOperario(this.operario.id);
    }
  }

  getOperario(id: number) {
    this.someOperario.view(id).subscribe({
      next: (operario) => {
        this.operario = operario;
        this.operarioForm.patchValue({
          user_id: operario.user_id,
          experiencia: operario.experiencia,
          periodoInit: operario.periodoInit,
          periodoEnd: operario.periodoEnd
        });
        console.log('Operario fetched successfully:', this.operario);
      },
      error: (error) => {
        console.error('Error fetching Operario:', error);
        Swal.fire('Error', 'No se pudo cargar el operario', 'error');
      }
    });
  }

  private showValidationErrors(): void {
    const fieldLabels = {
      user_id: 'ID de Usuario',
      experiencia: 'Experiencia',
      periodoInit: 'Fecha de Inicio',
      periodoEnd: 'Fecha de Fin'
    };

    const errorMessages: string[] = [];
    
    Object.keys(this.operarioForm.controls).forEach(key => {
      const control = this.operarioForm.get(key);
      const fieldLabel = fieldLabels[key as keyof typeof fieldLabels];
      
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
        if (control.errors['pattern'] && (key === 'periodoInit' || key === 'periodoEnd')) {
          errorMessages.push(`${fieldLabel} debe tener formato YYYY-MM-DD`);
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

  create() {
    if (this.operarioForm.invalid) {
      this.markFormGroupTouched(this.operarioForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.operarioForm.value;
    const payload = {
      user_id: formValue.user_id,
      experiencia: formValue.experiencia,
      periodoInit: formValue.periodoInit,
      periodoEnd: formValue.periodoEnd
    };

    this.someOperario.create(payload).subscribe({
      next: (operario) => {
        console.log('Operario created successfully:', operario);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => this.router.navigate(['/operario/list']));
      },
      error: (error) => {
        console.error('Error creating Operario:', error);
        Swal.fire('Error', 'No se pudo crear el operario', 'error');
      }
    });
  }

  update() {
    if (this.operarioForm.invalid) {
      this.markFormGroupTouched(this.operarioForm);
      this.showValidationErrors();
      return;
    }

    const formValue = this.operarioForm.value;
    const payload = {
      user_id: formValue.user_id,
      experiencia: formValue.experiencia,
      periodoInit: formValue.periodoInit,
      periodoEnd: formValue.periodoEnd
    };

    this.someOperario.update(this.operario.id!, payload).subscribe({
      next: (operario) => {
        console.log('Operario updated successfully:', operario);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        }).then(() => this.router.navigate(['/operario/list']));
      },
      error: (error) => {
        console.error('Error updating Operario:', error);
        Swal.fire('Error', 'No se pudo actualizar el operario', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['operario/list'])
  }
  delete(id: number) {
    console.log("Delete Operario with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está Operario que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someOperario.delete(id).
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
