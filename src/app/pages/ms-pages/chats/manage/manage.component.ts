import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chat } from 'src/app/models/chat.model';
import { ChatsService } from 'src/app/services/chatService/chats.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; //1->View, 2->Create, 3-> Update
  chat: Chat;
  chatForm: FormGroup;

  constructor(
    private activateRoute: ActivatedRoute,
    private someChat: ChatsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.chat = { id: 0 };
    this.initForm();
  }

  private initForm(): void {
    this.chatForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      tipo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  // Helper method to check form field validation
  getFieldError(field: string): string | null {
    const control = this.chatForm.get(field);
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

  private markFormGroupTouched(formGroup: FormGroup) {
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
      this.chatForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.chat.id = this.activateRoute.snapshot.params.id;
      this.getChat(this.chat.id);
    }
  }  getChat(id: number) {
    this.someChat.view(id).subscribe({
      next: (chat) => {
        this.chat = chat;
        this.chatForm.patchValue(chat);
        console.log('chat fetched successfully:', this.chat);
      },
      error: (error) => {
        console.error('Error fetching chat:', error);
        if (error.status === 404) {
          Swal.fire({
            title: 'No encontrado',
            text: 'El chat solicitado no existe.',
            icon: 'warning',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al intentar obtener el chat.',
            icon: 'error',
          });
        }
      }
    });
  }

  back() {
    this.router.navigate(['chat/list'])
  }

  create() {
    if (this.chatForm.invalid) {
      this.markFormGroupTouched(this.chatForm);
      Swal.fire({
        title: 'Error!',
        text: 'Por favor complete todos los campos requeridos correctamente.',
        icon: 'error'
      });
      return;
    }

    const formValue = this.chatForm.value;
    this.chat = { ...this.chat, ...formValue };

    this.someChat.create(this.chat).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/chats/list']);
        });
      },
      error: (error) => {
        console.error('Error al crear:', error);
        Swal.fire('Error', 'No se pudo crear el registro.', 'error');
      }
    });
  }

  update() {
    if (this.chatForm.invalid) {
      this.markFormGroupTouched(this.chatForm);
      Swal.fire({
        title: 'Error!',
        text: 'Por favor complete todos los campos requeridos correctamente.',
        icon: 'error'
      });
      return;
    }

    const formValue = this.chatForm.value;
    this.chat = { ...this.chat, ...formValue };

    this.someChat.update(this.chat).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/chats/list']);
        });
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
      }
    });
  }
  delete(id: number) {
    console.log("Delete chat with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está chat que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someChat.delete(id).
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
