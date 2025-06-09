import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObraMunicipio } from 'src/app/models/obra-municipio.model';
import { ObraMunicipioService } from 'src/app/services/obraMunicipioService/obra-municipio.service';
import { MunicipioService } from 'src/app/services/municipioService/municipio.service';
import { ObraService } from 'src/app/services/obraService/obra.service';
import { Municipio } from 'src/app/models/municipio.model';
import { Obra } from 'src/app/models/obra.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  obramunicipio: ObraMunicipio;
  municipios: Municipio[];
  obras: Obra[];
  constructor(private activateRoute: ActivatedRoute,
    private someObraMunicipio: ObraMunicipioService,
    private router: Router,
    private municipioService: MunicipioService,
    private obraService: ObraService
  ) {
    this.municipios = [];
    this.obras = [];
    this.obramunicipio = { 
      id: 0,
      obra_id: undefined,
      municipio_id: undefined
    }
  }

  municipiosList() {
    this.municipioService.list().subscribe(response => {
      this.municipios = response.data || [];
      console.log('Municipios fetched successfully:', this.municipios);
    });
  }

  obrasList() {
    this.obraService.list().subscribe(data => {
      this.obras = data;
      console.log('Obras fetched successfully:', this.obras);
    });
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
    
    // Cargar las listas de municipios y obras primero
    this.municipiosList();
    this.obrasList();
    
    // Si hay un ID en la ruta, cargar el registro después de un breve delay
    // para asegurar que las listas estén cargadas
    if (this.activateRoute.snapshot.params.id) {
      this.obramunicipio.id = this.activateRoute.snapshot.params.id;
      setTimeout(() => {
        this.getObraMunicipio(this.obramunicipio.id);
      }, 500);
    }
  }
  getObraMunicipio(id: number) {
    this.someObraMunicipio.view(id).subscribe({
      next: (obramunicipio) => {
        this.obramunicipio = obramunicipio;
        console.log('obramunicipio fetched successfully:', this.obramunicipio);
        
        // Si los datos vienen como IDs del backend, necesitamos buscar los objetos completos
        if (this.obramunicipio.obra_id && typeof this.obramunicipio.obra_id === 'number') {
          const obraId = this.obramunicipio.obra_id as any;
          this.obramunicipio.obra_id = this.obras.find(obra => obra.id === obraId);
        }
        
        if (this.obramunicipio.municipio_id && typeof this.obramunicipio.municipio_id === 'number') {
          const municipioId = this.obramunicipio.municipio_id as any;
          this.obramunicipio.municipio_id = this.municipios.find(municipio => municipio.id === municipioId);
        }
      },
      error: (error) => {
        console.error('Error fetching obramunicipio:', error);
      }
    });
  }
  back() {
    this.router.navigate(['obramunicipio/list'])
  }  create() {
    // Validar que se hayan seleccionado tanto obra como municipio
    if (!this.obramunicipio.obra_id || !this.obramunicipio.municipio_id) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor selecciona tanto una obra como un municipio.',
        icon: 'error',
      });
      return;
    }

    // Preparar el objeto para envío al backend con solo los IDs
    const obraMunicipioToCreate = {
      obra_id: this.obramunicipio.obra_id.id,
      municipio_id: this.obramunicipio.municipio_id.id
    } as any;

    this.someObraMunicipio.create(obraMunicipioToCreate).subscribe({
      next: (obramunicipio) => {
        console.log('obramunicipio created successfully:', obramunicipio);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/obramunicipio/list']);
      },
      error: (error) => {
        console.error('Error creating obramunicipio:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al crear el registro.',
          icon: 'error',
        });
      }
    });
  }
  update() {
    // Validar que se hayan seleccionado tanto obra como municipio
    if (!this.obramunicipio.obra_id || !this.obramunicipio.municipio_id) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor selecciona tanto una obra como un municipio.',
        icon: 'error',
      });
      return;
    }

    // Preparar el objeto para envío al backend con solo los IDs
    const obraMunicipioToUpdate = {
      id: this.obramunicipio.id,
      obra_id: this.obramunicipio.obra_id.id,
      municipio_id: this.obramunicipio.municipio_id.id
    } as any;

    this.someObraMunicipio.update(obraMunicipioToUpdate).subscribe({
      next: (obramunicipio) => {
        console.log('obramunicipio updated successfully:', obramunicipio);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/obramunicipio/list']);
      },
      error: (error) => {
        console.error('Error updating obramunicipio:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el registro.',
          icon: 'error',
        });
      }
    });
  }
  delete(id: number) {
    console.log("Delete obramunicipio with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está obramunicipio que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { 
        this.someObraMunicipio.delete(id).
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
