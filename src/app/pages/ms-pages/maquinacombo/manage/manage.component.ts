import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaquinaCombo } from 'src/app/models/maquina-combo.model';
import { MaquinaComboService } from 'src/app/services/maquinaComboService/maquina-combo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; //1->View, 2->Create, 3-> Update
  maquinacombo: MaquinaCombo;

  constructor(private activateRoute: ActivatedRoute,
    private someMaquinaCombo: MaquinaComboService,
    private router: Router
  ) {
    this.maquinacombo = { id: 0 }
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
      this.maquinacombo.id = this.activateRoute.snapshot.params.id  
      this.getMaquinaCombo(this.maquinacombo.id)
    }
  }
  getMaquinaCombo(id: number) {
    this.someMaquinaCombo.view(id).subscribe({
      next: (maquinacombo) => {
        this.maquinacombo = maquinacombo;
        console.log('maquinacombo fetched successfully:', this.maquinacombo);
      },
      error: (error) => {
        console.error('Error fetching maquinacombo:', error);
      }
    });
  }
  back() {
    this.router.navigate(['maquinacombo/list'])
  }
  create() {
    this.someMaquinaCombo.create(this.maquinacombo).subscribe({
      next: (maquinacombo) => {
        console.log('maquinacombo created successfully:', maquinacombo);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/maquinacombo/list']);
      },
      error: (error) => {
        console.error('Error creating maquinacombo:', error);
      }
    });
  }
  update() {
    this.someMaquinaCombo.update(this.maquinacombo).subscribe({
      next: (maquinacombo) => {
        console.log('maquinacombo updated successfully:', maquinacombo);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/maquinacombo/list']);
      },
      error: (error) => {
        console.error('Error updating maquinacombo:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete maquinacombo with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está maquinacombo que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someMaquinaCombo.delete(id).
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
