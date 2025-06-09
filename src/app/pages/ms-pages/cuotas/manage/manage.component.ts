import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cuotas } from 'src/app/models/cuotas.model';
import { CuotasService } from 'src/app/services/cuotasService/cuotas.service';
import { ServicioService } from 'src/app/services/servicioService/servicio.service';
import { Servicio } from 'src/app/models/servicio.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1->View, 2->Create, 3->Update
  cuota: Cuotas;
  cuotaForm: FormGroup;
  availableServices: Servicio[] = [];

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

  constructor(
    private activateRoute: ActivatedRoute,
    private cuotasService: CuotasService,
    private servicioService: ServicioService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.cuota = { id: 0 };
    this.createForm();
  }

  ngOnInit(): void {
    // Set mode based on route
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.cuotaForm.disable();
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    // Load services
    this.loadServices();

    // Load cuota if updating or viewing
    if (this.activateRoute.snapshot.params.id) {
      this.cuota.id = this.activateRoute.snapshot.params.id;
      this.loadCuota(this.cuota.id);
    }
  }

  private loadServices(): void {
    this.servicioService.list().subscribe({
      next: (services) => {
        this.availableServices = services;
      },
      error: (error) => {
        console.error('Error fetching services:', error);
        Swal.fire('Error', 'No se pudieron cargar los servicios', 'error');
      }
    });
  }

  private loadCuota(id: number): void {
    this.cuotasService.view(id).subscribe({
      next: (cuota) => {
        this.cuota = cuota;
        this.cuotaForm.patchValue({
          id_servicio: Array.isArray(cuota.id_servicio) && cuota.id_servicio.length > 0 ? cuota.id_servicio[0].id : cuota.id_servicio,
          valor: cuota.valor
        });
      },
      error: (error) => {
        console.error('Error fetching cuota:', error);
        Swal.fire('Error', 'No se pudo cargar la cuota', 'error');
      }
    });
  }

  private createForm(): void {
    this.cuotaForm = this.fb.group({
      id_servicio: [null, [Validators.required]],
      valor: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+([.][0-9]{0,2})?$/)
      ]]
    });
  }

  back(): void {
    this.router.navigate(['/cuotas/list']);
  }

  create(): void {
    if (this.cuotaForm.valid) {
      const formValue = this.cuotaForm.value;
      const payload = {
        ...this.cuota,
        id_servicio: formValue.id_servicio,
        valor: formValue.valor
      };
      this.cuotasService.create(payload).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Cuota creada correctamente', 'success');
          this.router.navigate(['/cuotas/list']);
        },
        error: (error) => {
          console.error('Error creating cuota:', error);
          Swal.fire('Error', 'No se pudo crear la cuota', 'error');
        }
      });
    } else {
      Object.keys(this.cuotaForm.controls).forEach(key => {
        const control = this.cuotaForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  update(): void {
    if (this.cuotaForm.valid) {
      const formValue = this.cuotaForm.value;
      const payload = {
        ...this.cuota,
        id_servicio: formValue.id_servicio,
        valor: formValue.valor
      };
      this.cuotasService.update(payload).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Cuota actualizada correctamente', 'success');
          this.router.navigate(['/cuotas/list']);
        },
        error: (error) => {
          console.error('Error updating cuota:', error);
          Swal.fire('Error', 'No se pudo actualizar la cuota', 'error');
        }
      });
    } else {
      Object.keys(this.cuotaForm.controls).forEach(key => {
        const control = this.cuotaForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
