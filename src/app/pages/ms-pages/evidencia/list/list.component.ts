import { Component, OnInit } from '@angular/core';
import { Evidencia } from 'src/app/models/evidencia.model'; // Importa el modelo Evidence
import { EvidenciaService } from 'src/app/services/evidenciaService/evidencia.service'; // Importa el servicio EvidenceService
// import { Router } from '@angular/router'; // Importa Router si necesitas navegación

@Component({
  selector: 'app-list-evidencia',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListEvidenciaComponent implements OnInit {

  evidencias: Evidencia[] = []; // Arreglo para almacenar evidencias, tipado con el modelo Evidence

  // Inyecta el servicio EvidenceService y Router (si lo necesitas)
  constructor(private EvidenciaService: EvidenciaService /*, private router: Router*/) { }

  ngOnInit(): void {
    // Llama al servicio para obtener la lista de evidencias
    this.EvidenciaService.list().subscribe(data => {
      this.evidencias = data; // Asigna los datos a la propiedad evidences
    });
  }

  // Métodos para editar y eliminar (ajusta el tipo de ID según tu modelo Evidence)
  edit(id: number) {
    console.log('Editando Evidencia ID:', id);
    // Implementa navegación, ej: this.router.navigate(['/admin/evidence/edit', id]);
  }

  delete(id: number) {
    console.log('Eliminando Evidencia ID:', id);
    // Implementa la llamada al servicio delete, ej:
    // this.evidenceService.delete(id).subscribe(() => {
    //   console.log('Evidencia eliminada con éxito');
    //   this.ngOnInit(); // Recarga la lista
    // });
  }
}