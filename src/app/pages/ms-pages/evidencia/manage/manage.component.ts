import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evidencia } from 'src/app/models/evidencia.model';
import { EvidenciaService } from 'src/app/services/evidenciaService/evidencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  evidencia: Evidencia;

  constructor(private activateRoute: ActivatedRoute,
    private someEvidencia: EvidenciaService,
    private router: Router
  ) {
    this.evidencia = { id: 0 }
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
      this.evidencia.id = this.activateRoute.snapshot.params.id  
      this.getEvidencia(this.evidencia.id)
    }
  }
  getEvidencia(id: number) {
    this.someEvidencia.view(id).subscribe({
      next: (evidencia) => {
        this.evidencia = evidencia;
        console.log('evidencia fetched successfully:', this.evidencia);
      },
      error: (error) => {
        console.error('Error fetching evidencia:', error);
      }
    });
  }
  back() {
    this.router.navigate(['evidencia/list'])
  }
  create() {
    this.someEvidencia.create(this.evidencia).subscribe({
      next: (evidencia) => {
        console.log('evidencia created successfully:', evidencia);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/evidencia/list']);
      },
      error: (error) => {
        console.error('Error creating evidencia:', error);
      }
    });
  }
  update() {
    this.someEvidencia.update(this.evidencia).subscribe({
      next: (evidencia) => {
        console.log('evidencia updated successfully:', evidencia);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/evidencia/list']);
      },
      error: (error) => {
        console.error('Error updating evidencia:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete evidencia with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está evidencia que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someEvidencia.delete(id).
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
