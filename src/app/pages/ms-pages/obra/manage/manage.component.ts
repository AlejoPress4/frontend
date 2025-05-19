import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Obra } from 'src/app/models/obra.model';
import { ObraService } from 'src/app/services/obraService/obra.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
    theFormGroup: FormGroup
  mode: number; //1->View, 2->Create, 3-> Update
  obra: Obra;


  constructor(private activateRoute: ActivatedRoute,
    private someObra: ObraService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.obra = {
      id: 0,
      nombre: '',
      combo_id: 1 
    };
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
    if (this.activateRoute.snapshot.params.id) {
      this.obra.id = this.activateRoute.snapshot.params.id
      this.getObra(this.obra.id)
    }
    this.configFormGroup();
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      nombre:['', [Validators.required, Validators.minLength(3)]],
      combo_id: [0, [Validators.required]], // Default value for combo
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getObra(id: number) {
    this.someObra.view(id).subscribe({
      next: (obra) => {
        this.obra = obra;
        console.log('obra fetched successfully:', this.obra);
      },
      error: (error) => {
        console.error('Error fetching obra:', error);
      }
    });
  }
  back() {
    this.router.navigate(['obra/list'])
  }

  
create() {
  if (this.theFormGroup.invalid) {
    Swal.fire("Error", "Por favor llene correctamente los campos", "error");
  } else {
    // Actualiza this.obra con los valores del formulario
    this.obra = {
      ...this.obra,
      ...this.theFormGroup.value
    };
    this.someObra.create(this.obra).subscribe({
      next: (obra) => {
        console.log('obra created successfully:', obra);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/obra/list']);
      },
      error: (error) => {
        console.error('Error creating obra:', error);
      }
    });
  }
}

  update() {
    if(this.theFormGroup.invalid) {
      Swal.fire("Error", "Por favor llene correctamente los campos", "error");
    }else{
      this.someObra.update(this.obra).subscribe({
        next: (obra) => {
          console.log('obra updated successfully:', obra);
          Swal.fire({
            title: 'Actualizado!',
            text: 'Registro actualizado correctamente.',
            icon: 'success',
          })
          this.router.navigate(['/obra/list']);
        },
        error: (error) => {
          console.error('Error updating obra:', error);
        }
      });
    }
  }

  delete(id: number) {
    console.log("Delete obra with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está obra que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someObra.delete(id).
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
