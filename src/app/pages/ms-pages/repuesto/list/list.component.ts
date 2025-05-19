import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Repuesto } from 'src/app/models/repuesto.model'; // Importa el modelo Repuesto
import { RepuestoService } from 'src/app/services/repuestoService/repuesto.service'; // Importa el servicio RepuestoService
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Importa Router si necesitas navegación

@Component({
  selector: 'app-list-Repuesto',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListRepuestoComponent implements OnInit {

  repuestos: Repuesto[] = []; // Arreglo para almacenar repuestos, tipado con el modelo Repuesto

  // Inyecta el servicio RepuestoService y Router (si lo necesitas)
  constructor(private RepuestoService: RepuestoService, private router: Router) { }

  ngOnInit(): void {
    // Llama al servicio para obtener la lista de repuestos
    this.RepuestoService.list().subscribe(data => {
      this.repuestos = data; // Asigna los datos a la propiedad Repuestos
    });
  }

  // Métodos para editar y eliminar (ajusta el tipo de ID según tu modelo Repuesto)
  edit(id: number) {
    this.router.navigate(['repuesto/update', id])
    // Implementa navegación, ej: this.router.navigate(['/admin/Repuesto/edit', id]);
  }

  delete(id: number) {
console.log("Delete repuesto with id:", id);
        Swal.fire({
          title: 'Eliminar',
          text: "Está seguro que quiere eliminar el registro?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.RepuestoService.delete(id).
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