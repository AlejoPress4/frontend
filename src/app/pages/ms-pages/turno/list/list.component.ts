// shift/list/list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turno } from 'src/app/models/turno.model';
import { TurnoService } from 'src/app/services/turnoService/turno.service';
// import { Router } from '@angular/router'; // Import Router if you need navigation

@Component({
  selector: 'app-list-Turno',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListTurnoComponent implements OnInit {

  turnos: Turno[] = []; // Array to store Turnos

  // Inject the service and Router (if needed)
  constructor(private TurnoService: TurnoService,  private router: Router) { }
  ngOnInit(): void {
    this.TurnoService.list().subscribe(data => {
      this.turnos = data; // Assign data to the array property
    });
  }

  // Methods for edit and delete (adjust ID type based on your model)
  edit(id: number) {
    this.router.navigate(['/turnos/update', id]);
    // Implement navigation
  }

  delete(id: number) {
    this.router.navigate(['/turnos/delete', id]);
    // Implement call to the delete service method
  }
}