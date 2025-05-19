import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private activateRoute: ActivatedRoute,
    private someChat: ChatsService,
    private router: Router
  ) {
    this.chat = { id: 0 }
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
      this.chat.id = this.activateRoute.snapshot.params.id
      this.getChat(this.chat.id)
    }
  }
  getChat(id: number) {
    this.someChat.view(id).subscribe({
      next: (chat) => {
        this.chat = chat;
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
    this.someChat.create(this.chat).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/chats/list']); // Redirigir a la lista
        });
      },
      error: (error) => {
        console.error('Error al crear:', error);
        Swal.fire('Error', 'No se pudo crear el registro.', 'error');
      }
    });
  }
  update() {
    this.someChat.update(this.chat).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/chats/list']); // Redirigir a la lista
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
