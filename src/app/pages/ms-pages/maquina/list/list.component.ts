import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Maquina } from 'src/app/models/maquina.model'; // Importa el modelo Maquina
import { MaquinaService } from 'src/app/services/maquinaService/maquina.service'; // Importa el servicio MaquinaService
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Importa Router si necesitas navegación

@Component({
  selector: 'app-list-maquina',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListMaquinaComponent implements OnInit {

  maquinas: Maquina[] = []; // Arreglo para almacenar maquinarias, tipado con el modelo Maquina

  // Inyecta el servicio MaquinaService y Router (si lo necesitas)
  constructor(private MaquinaService: MaquinaService, private router: Router) { }

  ngOnInit(): void {
    // Llama al servicio para obtener la lista de maquinarias
    this.MaquinaService.list().subscribe(data => {
      this.maquinas = data; // Asigna los datos a la propiedad machineries
    });
  }

  // Métodos para editar y eliminar (ajusta el tipo de ID según tu modelo Maquina)
  edit(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }
    this.router.navigate([`/maquinas/update`, id]).then(
      (success) => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Redirigido',
            text: 'Navegación exitosa al formulario de edición.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo navegar al formulario de edición.'
          });
        }
      },
      (error) => {
        console.error('Error al navegar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar navegar al formulario de edición.'
        });
      }
    );
  }

  delete(id: number) {
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
        this.MaquinaService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar la máquina:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}