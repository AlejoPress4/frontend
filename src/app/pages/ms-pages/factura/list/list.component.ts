import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/models/factura.model'; // Cambié el modelo a Factura
import { FacturaService } from 'src/app/services/facturaService/factura.service'; // Cambié el servicio a FacturaService
// import { Router } from '@angular/router'; // Importa Router si necesitas navegación

@Component({
  selector: 'app-list-factura', // Cambié el selector para reflejar el cambio a Factura
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListFacturaComponent implements OnInit { // Cambié el nombre de la clase a ListFacturaComponent

  facturas: Factura[] = []; // Cambié 'bills' a 'facturas' para reflejar el cambio al español

  // Inyecta el servicio BillService y Router (si lo necesitas)
  constructor(private facturaService: FacturaService /*, private router: Router*/) { }

  ngOnInit(): void {
    // Llama al servicio para obtener la lista de facturas
    this.facturaService.list().subscribe(data => {
      this.facturas = data; // Asigna los datos a la propiedad facturas
    });
  }

  // Métodos para editar y eliminar (ajusta el tipo de ID según tu modelo Bill)
  edit(id: number) {
    console.log('Editando Factura ID:', id);
    // Implementa navegación, ej: this.router.navigate(['/admin/factura/edit', id]);
  }

  delete(id: number) {
    console.log('Eliminando Factura ID:', id);
    // Implementa la llamada al servicio delete, ej:
    // this.facturaService.delete(id).subscribe(() => {
    //   console.log('Factura eliminada con éxito');
    //   this.ngOnInit(); // Recarga la lista
    // });
  }
}