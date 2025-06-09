// ruler/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Gobernante } from 'src/app/models/gobernante.model';
import { GobernanteService } from 'src/app/services/gobernanteService/gobernante.service';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-gobernante',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListGobernanteComponent implements OnInit {

  gobernantes: Gobernante[] = []; // Array to store Gobernantes

  // Inject the service and Router (if needed)
  constructor(private GobernanteService: GobernanteService /*, private router: Router*/) { }

  ngOnInit(): void {
    // Call the service to get the list
    this.GobernanteService.list().subscribe(data => {
      this.gobernantes = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    console.log('Editing Gobernante ID:', id);
    // Implement navigation
  }

  delete(id: number) {
    console.log('Deleting Gobernante ID:', id);
    // Implement call to the delete service method
  }
}