import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Combo } from 'src/app/models/combo.model';
import { CombosService } from 'src/app/services/comboService/combos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  combo: Combo;

  constructor(private activateRoute: ActivatedRoute,
    private someCombo: CombosService,
    private router: Router
  ) {
    this.combo = { id: 0 }
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
      this.combo.id = this.activateRoute.snapshot.params.id
      this.getCombo(this.combo.id)
    }
  }
  getCombo(id: number) {
    this.someCombo.view(id).subscribe({
      next: (combo) => {
        this.combo = combo;
        console.log('combo fetched successfully:', this.combo);
      },
      error: (error) => {
        console.error('Error fetching combo:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/combos/list']);
  }
  create() {
    this.someCombo.create(this.combo).subscribe({
      next: (combo) => {
        console.log('combo created successfully:', combo);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/combos/list']);
      },
      error: (error) => {
        console.error('Error creating combo:', error);
      }
    });
  }
  update() {
    this.someCombo.update(this.combo).subscribe({
      next: (combo) => {
        console.log('cuota updated successfully:', combo);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/combos/list']);
      },
      error: (error) => {
        console.error('Error updating combo:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete combo with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está combo que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someCombo.delete(id).
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
