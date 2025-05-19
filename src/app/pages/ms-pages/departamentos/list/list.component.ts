import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DepartamentoService } from 'src/app/services/departamentoService/departamento.service';
import { Departamento } from 'src/app/models/departamento.model';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  departamentos: any[] = [];
  nombresColumnas: string[] = ['id', 'nombre'];

  constructor(private miServicioDepartamento: DepartamentoService) { }

  ngOnInit(): void {
    this.list();

  }

  list():void{
    this.miServicioDepartamento.list().subscribe(response => {
      this.departamentos = response.data || [];
    }
    );
  }

}
