// departmentruler/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { GobernanteDepartamento } from 'src/app/models/gobernante-departamento.model';
import { GobernanteDepartamentoService } from 'src/app/services/gobernanteDepartamentoService/gobernante-departamento.service';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-department-ruler',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListGobernanteDepartamentoComponent implements OnInit {

  gobernanteDepartamentos: GobernanteDepartamento[] = []; // Array to store department-ruler links

  // Inject the GobernanteDepartamentoService and Router (if needed)
  constructor(private GobernanteDepartamentoService: GobernanteDepartamentoService /*, private router: Router*/) { }

  ngOnInit(): void {
    // Call the service to get the list of links
    this.GobernanteDepartamentoService.list().subscribe(data => {
      this.gobernanteDepartamentos = data; // Assign data to the GobernanteDepartamentos array
    });
  }

  // Methods for edit and delete (adjust ID type based on your GobernanteDepartamento model)
  edit(id: number) {
    console.log('Editing Department-Ruler Link ID:', id);
    // Implement navigation, e.g: this.router.navigate(['/admin/GobernanteDepartamento/edit', id]);
  }

  delete(id: number) {
    console.log('Deleting Department-Ruler Link ID:', id);
    // Implement the call to the delete service method, e.g:
    // this.GobernanteDepartamentoService.delete(id).subscribe(() => {
    //   console.log('Department-Ruler Link deleted successfully');
    //   this.ngOnInit(); // Reload the list
    // });
  }
}