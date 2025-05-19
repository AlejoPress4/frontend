import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from 'src/app/models/factura.model';
import { FacturaService } from 'src/app/services/facturaService/factura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {



  mode: number; //1->View, 2->Create, 3-> Update
  factura: Factura;

  constructor(private activateRoute: ActivatedRoute,
    private someFactura: FacturaService,
    private router: Router
  ) {
    this.factura = { id: 0 }
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
      this.factura.id = this.activateRoute.snapshot.params.id  
      this.getFactura(this.factura.id)
    }
  }
  getFactura(id: number) {
    this.someFactura.view(id).subscribe({
      next: (factura) => {
        this.factura = factura;
        console.log('factura fetched successfully:', this.factura);
      },
      error: (error) => {
        console.error('Error fetching factura:', error);
      }
    });
  }
  back() {
    this.router.navigate(['factura/list'])
  }
  create() {
    this.someFactura.create(this.factura).subscribe({
      next: (factura) => {
        console.log('factura created successfully:', factura);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/factura/list']);
      },
      error: (error) => {
        console.error('Error creating factura:', error);
      }
    });
  }
  update() {
    this.someFactura.update(this.factura).subscribe({
      next: (factura) => {
        console.log('factura updated successfully:', factura);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/factura/list']);
      },
      error: (error) => {
        console.error('Error updating factura:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete factura with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está factura que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someFactura.delete(id).
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
