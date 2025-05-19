import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Poliza } from 'src/app/models/poliza.model'; // Importa el modelo Policy
import { PolizaService } from 'src/app/services/polizaService/poliza.service'; // Importa el servicio PolicyService
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Importa Router si necesitas navegación

@Component({
  selector: 'app-list-policy',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPolizaComponent implements OnInit {

  polizas: Poliza[] = []; // Cambié 'policies' a 'polizas' para reflejar el cambio al español

  // Inyecta el servicio PolicyService y Router (si lo necesitas)
  constructor(private polizaService: PolizaService, private router: Router) { }

  ngOnInit(): void {
    // Llama al servicio para obtener la lista de pólizas
    this.polizaService.list().subscribe(data => {
      this.polizas = data; // Asigna los datos a la propiedad polizas
    }, error => {
      console.error('Error al cargar las pólizas:', error);
      this.polizas = []; // Asegura que polizas esté inicializado incluso si hay un error
    });
  }

  // Métodos para editar y eliminar (ajusta el tipo de ID según tu modelo Policy)
  edit(id: number) {
    this.router.navigate(['polizas/update', id])
    // Implementa navegación, ej: this.router.navigate(['/admin/policy/edit', id]);
  }

  delete(id: number) {
    console.log("Delete poliza with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está poliza que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.polizaService.delete(id).
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