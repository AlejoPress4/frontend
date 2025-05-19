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
  constructor(private MaquinaService: MaquinaService , private router: Router) { }

  ngOnInit(): void {
    // Llama al servicio para obtener la lista de maquinarias
    this.MaquinaService.list().subscribe(data => {
      this.maquinas = data; // Asigna los datos a la propiedad machineries
    });
  }

  // Métodos para editar y eliminar (ajusta el tipo de ID según tu modelo Maquina)
  edit(id: number) {
    this.router.navigate(['maquina/update', id])
    // Implementa navegación, ej: this.router.navigate(['/admin/Maquina/edit', id]);
  }

  delete(id: number) {
  console.log("Delete seguro with id:", id);
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
            this.MaquinaService.delete(id).
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