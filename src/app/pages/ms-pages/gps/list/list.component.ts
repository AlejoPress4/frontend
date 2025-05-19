// gps/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GPS } from 'src/app/models/gps.model';
import { GPSService } from 'src/app/services/gpsService/gps.service';
import Swal from 'sweetalert2';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-gps',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListGpsComponent implements OnInit {

  gpsPoints: GPS[] = []; // Array to store GPS points

  constructor(private gpsService: GPSService , private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list of GPS points
    this.gpsService.list().subscribe(data => {
      this.gpsPoints = data; // Assign data to the gpsPoints array
    });
  }

  // Methods for edit and delete (adjust ID type based on your Gps model)
  edit(id: number) {
    this.router.navigate(['gps/update', id])
    // Implement navigation, e.g: this.router.navigate(['/admin/gps/edit', id]);
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
            this.gpsService.delete(id).
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