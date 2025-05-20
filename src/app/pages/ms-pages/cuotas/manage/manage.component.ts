import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuotas } from 'src/app/models/cuotas.model';
import { CuotasService } from 'src/app/services/cuotasService/cuotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1->View, 2->Create, 3->Update
  cuota: Cuotas;
  paymentData = {
    card: {
      number: '',
      exp_year: '',
      exp_month: '',
      cvc: ''
    },
    customer: {
      name: '',
      last_name: '',
      email: '',
      phone: '',
      doc_number: ''
    },
    due: {
      id: '',
      id_servicio: '',
      valor: ''
    },
    description: '',
    tax: '',
    tax_base: '',
    dues: ''
  };

  constructor(private activateRoute: ActivatedRoute,
    private cuotasService: CuotasService,
    private router: Router) {
    this.cuota = { id: 0 };
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
      this.cuota.id = this.activateRoute.snapshot.params.id;
      this.getCuota(this.cuota.id);
    }
  }  getCuota(id: number) {    this.cuotasService.view(id).subscribe({
      next: (cuota) => {
        // Set the main model
        this.cuota = cuota;
        
        // Synchronize with form model
        this.paymentData.due = {
          id: cuota.id?.toString() || '',
          valor: cuota.valor?.toString() || '',
          id_servicio: cuota.id_servicio?.toString() || ''
        };
        
        console.log('Cuota fetched and synchronized:', {
          cuota: this.cuota,
          formData: this.paymentData.due
        });
      },
      error: (error) => {
        console.error('Error fetching cuota:', error);
        Swal.fire('Error', 'No se pudo cargar la información de la cuota.', 'error');
      }
    });
  }

  back() {
    this.router.navigate(['/cuotas/list']);
  }

  create() {
    this.cuotasService.create(this.cuota).subscribe({
      next: (cuota) => {
        console.log('Cuota created successfully:', cuota);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/cuotas/list']);
        });
      },
      error: (error) => {
        console.error('Error creating cuota:', error);
      }
    });
  }
  updateCuota(field: string, value: any) {
    // Actualiza el modelo cuota cuando cambian los valores en el formulario
    if (field === 'id_servicio') {
      this.cuota.id_servicio = Number(value);
    } else if (field === 'valor') {
      this.cuota.valor = Number(value);
    }
  }
  update() {
    // Validate fields are not empty
    if (!this.paymentData.due.id_servicio || !this.paymentData.due.valor) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos.', 'error');
      return;
    }

    // Synchronize form values with model
    this.cuota.id_servicio = Number(this.paymentData.due.id_servicio);
    this.cuota.valor = Number(this.paymentData.due.valor);

    // Validate numeric values
    if (isNaN(this.cuota.id_servicio) || isNaN(this.cuota.valor)) {
      Swal.fire('Error', 'Los valores numéricos no son válidos.', 'error');
      return;
    }

    this.cuotasService.update(this.cuota).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/cuotas/list']);
        });
      },
      error: (error) => {
        console.error('Error al actualizar la cuota:', error);
        Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
      }
    });
  }

  delete(id: number) {
    console.log('Delete cuota with id:', id);
    Swal.fire({
      title: 'Eliminar',
      text: 'Está seguro que quiere eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuotasService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit();
          },
          error: (error) => {
            console.error('Error deleting cuota:', error);
          }
        });
      }
    });
  }

  pay() {
    this.cuotasService.pay(this.paymentData).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Pago procesado exitosamente.', 'success');
        console.log('Payment response:', response);
      },
      error: (error) => {
        Swal.fire('Error', 'Hubo un problema al procesar el pago.', 'error');
        console.error('Payment error:', error);
      }
    });
  }
}
