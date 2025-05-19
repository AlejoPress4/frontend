// typeservice/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoServicio } from 'src/app/models/tipo-servicio.model';
import { TipoServicioService } from 'src/app/services/tipoServicioService/tipo-servicio.service';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-tipo-servicio',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListTipoServicioComponent implements OnInit {

  TipoServicios: TipoServicio[] = []; // Array to store service types

  // Inject the service and Router (if needed)
  constructor(private TipoServicioService: TipoServicioService, private router: Router) { }

  ngOnInit(): void {
    // Call the service to get the list
    this.TipoServicioService.list().subscribe(data => {
      this.TipoServicios = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    this.router.navigate(['/tiposervicio/update', id])
    // Implement navigation
  }

  delete(id: number) {
    console.log('Deleting Service Type ID:', id);
    // Implement call to the delete service method
  }
}