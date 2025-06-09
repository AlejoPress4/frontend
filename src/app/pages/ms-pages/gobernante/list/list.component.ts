// ruler/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Gobernante } from 'src/app/models/gobernante.model';
import { GobernanteService } from 'src/app/services/gobernanteService/gobernante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-gobernante',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListGobernanteComponent implements OnInit {

  gobernantes: Gobernante[] = []; // Array to store Gobernantes

  // Inject the service and Router (if needed)
  constructor(private GobernanteService: GobernanteService, private router: Router) { }

  ngOnInit(): void {
    console.log('ListGobernanteComponent ngOnInit: solicitando lista de gobernantes...');
    this.loadGobernantes();
  }

  loadGobernantes() {
    this.GobernanteService.list().subscribe(data => {
      console.log('Respuesta del backend (gobernantes):', data);
      this.gobernantes = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    console.log('Editing Gobernante ID:', id);
    this.router.navigate(['/gobernantes/update', id]);
  }

  delete(id: number) {
    console.log('Deleting Gobernante ID:', id);
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
        this.GobernanteService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.loadGobernantes();
          },
          error: (error) => {
            console.error('Error al eliminar el gobernante:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}