import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MunicipioService } from 'src/app/services/municipioService/municipio.service';
import { Municipio } from 'src/app/models/municipio.model';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  municipios: any[] = [];
  nombresColumnas: string[] = ['id', 'nombre', 'departamento_id'];

  constructor(private miServicioMunicipio: MunicipioService) { }

  ngOnInit(): void {
    this.list();

  }

  list():void{
    this.miServicioMunicipio.list().subscribe(response => {
      console.log('AAAAAAAAAAAAAAAAAAAAAAAAA', response);
      this.municipios = response.data || [];
    }
    );
  }

}
