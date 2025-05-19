// municipalityruler/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { GobernanteMunicipio } from 'src/app/models/gobernante-municipio.model';
import { GobernanteMunicipioService } from 'src/app/services/gobernanteMunicipioService/gobernante-municipio.service';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-municipality-ruler',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListGobernanteMunicipioComponent implements OnInit {

  gobernanteMunicipios: GobernanteMunicipio[] = []; // Array to store links

  // Inject the service and Router (if needed)
  constructor(private GobernanteMunicipioService: GobernanteMunicipioService /*, private router: Router*/) { }

  ngOnInit(): void {
    // Call the service to get the list
    this.GobernanteMunicipioService.list().subscribe(data => {
      this.gobernanteMunicipios = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    console.log('Editing Municipality-Ruler Link ID:', id);
    // Implement navigation
  }

  delete(id: number) {
    console.log('Deleting Municipality-Ruler Link ID:', id);
    // Implement call to the delete service method
  }
}