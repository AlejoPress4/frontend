// combomachinery/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaquinaCombo } from 'src/app/models/maquina-combo.model';
import { MaquinaComboService } from 'src/app/services/maquinaComboService/maquina-combo.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-combo-machinery',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListMaquinaComboComponent implements OnInit {

  maquinacombos: MaquinaCombo[] = []; // Array to store combo-machinery links

  // Inject the MaquinaComboService and Router (if needed)
  constructor(private MaquinaComboService: MaquinaComboService , private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of links
    this.MaquinaComboService.list().subscribe(data => {
      this.maquinacombos = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your MaquinaCombo model)
  edit(id: number) {
    this.router.navigate(['maquina-combo/update', id])
    // Implement navigation, e.g: this.router.navigate(['/admin/MaquinaCombo/edit', id]);
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
            this.MaquinaComboService.delete(id).
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