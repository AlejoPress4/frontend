import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GPS } from 'src/app/models/gps.model';
import { GPSService } from 'src/app/services/gpsService/gps.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-gps',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1; // 1 -> Ver, 2 -> Crear, 3 -> Actualizar
  gps: GPS = { id: 0 };

  constructor(
    private activatedRoute: ActivatedRoute,
    private gpsService: GPSService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    const idParam = this.activatedRoute.snapshot.params['id'];
    if (idParam) {
      this.gps.id = Number(idParam);
      this.getGPS(this.gps.id);
    }
  }

  getGPS(id: number): void {
    this.gpsService.view(id).subscribe({
      next: (gpsData) => {
        this.gps = gpsData;
        console.log('GPS obtenido exitosamente:', this.gps);
      },
      error: (error) => {
        console.error('Error al obtener el GPS:', error);
      }
    });
  }

  back(): void {
    this.router.navigate(['/gps/list']);
  }

  create(): void {
    console.log('Payload enviado al backend:', this.gps); // Log the payload for debugging
    this.gpsService.create(this.gps).subscribe({
      next: (createdGPS) => {
        console.log('GPS creado exitosamente:', createdGPS);
        Swal.fire({
          title: '¡Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success'
        });
        this.router.navigate(['/gps/list']);
      },
      error: (error) => {
        console.error('Error al crear el GPS:', error);
      }
    });
  }

  update(): void {
    this.gpsService.update(this.gps).subscribe({
      next: (updatedGPS) => {
        console.log('GPS actualizado exitosamente:', updatedGPS);
        Swal.fire({
          title: '¡Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        });
        this.router.navigate(['/gps/list']);
      },
      error: (error) => {
        console.error('Error al actualizar el GPS:', error);
      }
    });
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar',
      text: "¿Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gpsService.delete(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'Registro eliminado correctamente.',
            'success'
          );
          this.router.navigate(['/gps/list']);
        });
      }
    });
  }
}
