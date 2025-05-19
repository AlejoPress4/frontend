import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GPS } from 'src/app/models/gps.model';
import { GPSService } from 'src/app/services/gpsService/gps.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  gps: GPS;

  constructor(private activateRoute: ActivatedRoute,
    private someGPS: GPSService,
    private router: Router
  ) {
    this.gps = { id: 0 }
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
      this.gps.id = this.activateRoute.snapshot.params.id  
      this.getGPS(this.gps.id)
    }
  }
  getGPS(id: number) {
    this.someGPS.view(id).subscribe({
      next: (gps) => {
        this.gps = gps;
        console.log('gps fetched successfully:', this.gps);
      },
      error: (error) => {
        console.error('Error fetching gps:', error);
      }
    });
  }
  back() {
    this.router.navigate(['gps/list'])
  }
  create() {
    this.someGPS.create(this.gps).subscribe({
      next: (gps) => {
        console.log('gps created successfully:', gps);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gps/list']);
      },
      error: (error) => {
        console.error('Error creating gps:', error);
      }
    });
  }
  update() {
    this.someGPS.update(this.gps).subscribe({
      next: (gps) => {
        console.log('gps updated successfully:', gps);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gps/list']);
      },
      error: (error) => {
        console.error('Error updating gps:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete GPS with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está GPS que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someGPS.delete(id).
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
