import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gobernante } from 'src/app/models/gobernante.model';
import { GobernanteService } from 'src/app/services/gobernanteService/gobernante.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuarioService/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {


  mode: number; //1->View, 2->Create, 3-> Update
  gobernante: Gobernante;
  gobernantedepartamentos: any; // Agregué la propiedad para evitar errores en el template
  usuarios: Usuario[] = []; // Arreglo para almacenar los usuarios

  constructor(
    private activateRoute: ActivatedRoute,
    private someGobernante: GobernanteService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.gobernante = { id: 0 }
  }

  ngOnInit(): void {
    this.usuarioService.list().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
    this.activateRoute.url.subscribe(() => {
      const currentUrl = this.activateRoute.snapshot.url.join('/');
      if (currentUrl.includes('view')) {
        this.mode = 1;
      } else if (currentUrl.includes('create')) {
        this.mode = 2;
      } else if (currentUrl.includes('update')) {
        this.mode = 3;
      }
      const id = this.activateRoute.snapshot.params.id;
      if (id) {
        this.gobernante.id = id;
        this.getGobernante(this.gobernante.id);
      }
    });
  }

  getGobernante(id: number) {
    this.someGobernante.view(id).subscribe({
      next: (gobernante: any) => {
        this.gobernante.id = gobernante.id;
        this.gobernante.user_id = gobernante.user_id || (gobernante.user && gobernante.user.id) || '';
        this.gobernante.periodoInit = gobernante.periodoInit || gobernante.periodo_init || '';
        this.gobernante.periodoEnd = gobernante.periodoEnd || gobernante.periodo_end || '';
        this.gobernante.tipo = gobernante.tipo || '';
        // Asignar territorio según el tipo
        if (gobernante.territorio) {
          if (gobernante.tipo === 'departamento' && gobernante.territorio.departamento_id) {
            this.gobernante.departamento_id = gobernante.territorio.departamento_id;
            this.gobernante.municipio_id = undefined;
          } else if (gobernante.tipo === 'municipio' && gobernante.territorio.municipio_id) {
            this.gobernante.municipio_id = gobernante.territorio.municipio_id;
            this.gobernante.departamento_id = undefined;
          } else {
            this.gobernante.departamento_id = undefined;
            this.gobernante.municipio_id = undefined;
          }
        } else {
          this.gobernante.departamento_id = gobernante.departamento_id;
          this.gobernante.municipio_id = gobernante.municipio_id;
        }
        console.log('gobernante mapped for form:', this.gobernante);
      },
      error: (error) => {
        console.error('Error fetching gobernante:', error);
      }
    });
  }
  back() {
    this.router.navigate(['gobernante/list'])
  }
  create() {
    // Construir el objeto territorio según el tipo seleccionado
    let territorio: any = {};
    if (this.gobernante.tipo === 'departamento') {
      territorio = { departamento_id: this.gobernante.departamento_id };
    } else if (this.gobernante.tipo === 'municipio') {
      territorio = { municipio_id: this.gobernante.municipio_id };
    }
    const body: any = {
      user_id: this.gobernante.user_id,
      periodoInit: this.gobernante.periodoInit,
      periodoEnd: this.gobernante.periodoEnd,
      tipo: this.gobernante.tipo,
      territorio: territorio
    };
    this.someGobernante.create(body).subscribe({
      next: (gobernante) => {
        console.log('gobernante created successfully:', gobernante);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gobernante/list']);
      },
      error: (error) => {
        console.error('Error creating gobernante:', error);
      }
    });
  }
  update() {
    // Construir el objeto territorio según el tipo seleccionado
    let territorio: any = {};
    if (this.gobernante.tipo === 'departamento') {
      territorio = { departamento_id: this.gobernante.departamento_id };
    } else if (this.gobernante.tipo === 'municipio') {
      territorio = { municipio_id: this.gobernante.municipio_id };
    }
    const body: any = {
      id: this.gobernante.id,
      user_id: this.gobernante.user_id,
      periodoInit: this.gobernante.periodoInit,
      periodoEnd: this.gobernante.periodoEnd,
      tipo: this.gobernante.tipo,
      territorio: territorio
    };
    this.someGobernante.update(body).subscribe({
      next: (gobernante) => {
        console.log('gobernante updated successfully:', gobernante);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/gobernante/list']);
      },
      error: (error) => {
        console.error('Error updating gobernante:', error);
      }
    });
  }
  delete(id: number) {
    console.log("Delete gobernante with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está gobernante que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.someGobernante.delete(id).
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
