// service/list/list.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Servicio } from 'src/app/models/servicio.model';
import { ServicioService } from 'src/app/services/servicioService/servicio.service';
import Swal from 'sweetalert2'; // Asegúrate de que la ruta de importación es correcta

@Component({
  selector: 'app-list-service',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListServicioComponent implements OnInit {

  servicios: Servicio[]; // Array to store servicios

  // Inject the service and Router (if needed)
  constructor(private servicioService: ServicioService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('Componente ListServiceComponent inicializado'); // <-- Opcional: confirma que ngOnInit se ejecuta
    this.servicioService.list().subscribe(
      data => {
        console.log('Datos recibidos del servicio (subscribe):', data); // <-- Añade este log
        this.servicios = data; // Asigna los datos
        this.cdr.detectChanges(); // Forzar la detección de cambios
        console.log('Variable servicios del componente después de asignar:', this.servicios); // <-- Añade este log
      },
      error => {
        console.error('Error en la suscripción del servicio:', error); // <-- Añade log de error por si acaso
      }
    );
    console.log('Llamada a serviceService.list().subscribe() completada en ngOnInit'); // <-- Opcional
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    if (isNaN(id)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID proporcionado no es válido.'
      });
      return;
    }    this.router.navigate(['/servicios/update', id]).then(
      success => {
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
      error => {
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
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
            this.ngOnInit(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }  view(id: number) {
    this.router.navigate(['/servicios/list'])
  }
}