import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Poliza } from 'src/app/models/poliza.model';
import { PolizaService } from 'src/app/services/polizaService/poliza.service';
import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Operario } from 'src/app/models/operario.model';
import { Maquina } from 'src/app/models/maquina.model';
import { Seguro } from 'src/app/models/seguro.model';
import { OperarioService } from 'src/app/services/operarioService/operario.service';
import { MaquinaService } from 'src/app/services/maquinaService/maquina.service';
import { SeguroService } from 'src/app/services/seguroService/seguro.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1->View, 2->Create, 3-> Update
  poliza: Poliza;
  tipoPolizaOptions: string[] = [];
  theFormGroup: FormGroup;
  operarios: Operario[] = [];
  maquinas: Maquina[] = [];
  seguros: Seguro[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private somePoliza: PolizaService,
    private router: Router,
    private fb: FormBuilder,
    private operarioService: OperarioService,
    private maquinaService: MaquinaService,
    private seguroService: SeguroService
  ) {
    this.poliza = {
      id: 0,
      seguro_id: 0,
      tipo_poliza: '',
      fechaInicio: new Date(),
      fechaFin: new Date()
    };
    this.theFormGroup = this.fb.group({
      seguro_id: [0, Validators.required],
      maquina_id: [null],
      operario_id: [null],
      tipo_poliza: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    }, { validators: polizaXorValidator() });
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
      this.poliza.id = this.activateRoute.snapshot.params.id
      this.getPoliza(this.poliza.id)
    }
    this.loadOperarios();
    this.loadMaquinas();
    this.loadSeguros();
  }

  loadOperarios() {
    this.operarioService.list().subscribe({
      next: (operarios) => {
        this.operarios = operarios;
      },
      error: (error) => {
        console.error('Error loading operarios:', error);
      }
    });
  }

  loadMaquinas() {
    this.maquinaService.list().subscribe({
      next: (maquinas) => {
        this.maquinas = maquinas;
      },
      error: (error) => {
        console.error('Error loading maquinas:', error);
      }
    });
  }

  loadSeguros() {
    this.seguroService.list().subscribe({
      next: (seguros) => {
        this.seguros = seguros;
      },
      error: (error) => {
        console.error('Error loading seguros:', error);
      }
    });
  }

  onEntidadChange() {
    // Convertir a número o null para ambos campos
    let operarioId = this.poliza.operario_id;
    let maquinaId = this.poliza.maquina_id;
    // Si el valor es string, convertir a número o null
    if (typeof operarioId === 'string') {
      operarioId = (operarioId + '').trim() === '' ? null : Number(operarioId);
    }
    if (typeof maquinaId === 'string') {
      maquinaId = (maquinaId + '').trim() === '' ? null : Number(maquinaId);
    }
    // Si el valor es NaN, poner null
    if (typeof operarioId === 'number' && isNaN(operarioId)) operarioId = null;
    if (typeof maquinaId === 'number' && isNaN(maquinaId)) maquinaId = null;
    this.poliza.operario_id = operarioId;
    this.poliza.maquina_id = maquinaId;

    // Lógica de exclusión y opciones
    if (this.poliza.operario_id) {
      this.poliza.maquina_id = null;
      this.tipoPolizaOptions = ["ARL", "SEGURO_VIDA", "SEGURO_ACCIDENTES"];
    } else if (this.poliza.maquina_id) {
      this.poliza.operario_id = null;
      this.tipoPolizaOptions = ["TODO_RIESGO", "RESPONSABILIDAD_CIVIL", "DANOS_TERCEROS"];
    } else {
      this.tipoPolizaOptions = [];
    }
    // Limpiar tipo_poliza si cambia la entidad
    this.poliza.tipo_poliza = '';
    this.theFormGroup.patchValue({
      operario_id: this.poliza.operario_id,
      maquina_id: this.poliza.maquina_id,
      tipo_poliza: this.poliza.tipo_poliza
    });
    this.theFormGroup.updateValueAndValidity();
  }

  // Sincronizar tipo_poliza del select con el FormGroup
  onTipoPolizaChange(event: any) {
    const value = event && event.target ? event.target.value : event;
    this.poliza.tipo_poliza = value;
    this.theFormGroup.patchValue({ tipo_poliza: value });
    this.theFormGroup.updateValueAndValidity();
  }

  getPoliza(id: number) {
    this.somePoliza.view(id).subscribe({
      next: (poliza) => {
        this.poliza = poliza;
        // Determinar opciones de tipoPoliza según la entidad
        if (this.poliza.operario_id) {
          this.tipoPolizaOptions = ["ARL", "SEGURO_VIDA", "SEGURO_ACCIDENTES"];
        } else if (this.poliza.maquina_id) {
          this.tipoPolizaOptions = ["TODO_RIESGO", "RESPONSABILIDAD_CIVIL", "DANOS_TERCEROS"];
        } else {
          this.tipoPolizaOptions = [];
        }
        // Formatear fechas para los inputs tipo date solo si la fecha es válida
        let fechaInicioStr = '';
        let fechaFinStr = '';
        if (this.poliza.fechaInicio) {
          if (typeof this.poliza.fechaInicio === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(this.poliza.fechaInicio)) {
            fechaInicioStr = this.poliza.fechaInicio;
          } else if (!isNaN(new Date(this.poliza.fechaInicio).getTime())) {
            fechaInicioStr = this.formatDateForInput(this.poliza.fechaInicio);
          }
        }
        if (this.poliza.fechaFin) {
          if (typeof this.poliza.fechaFin === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(this.poliza.fechaFin)) {
            fechaFinStr = this.poliza.fechaFin;
          } else if (!isNaN(new Date(this.poliza.fechaFin).getTime())) {
            fechaFinStr = this.formatDateForInput(this.poliza.fechaFin);
          }
        }
        this.theFormGroup.patchValue({
          fechaInicio: fechaInicioStr,
          fechaFin: fechaFinStr
        });
        // También actualizar en el FormGroup para el binding reactivo
        this.theFormGroup.patchValue({
          operario_id: this.poliza.operario_id,
          maquina_id: this.poliza.maquina_id,
          tipo_poliza: this.poliza.tipo_poliza
        });
        setTimeout(() => {
          this.theFormGroup.patchValue({
            operario_id: this.poliza.operario_id,
            maquina_id: this.poliza.maquina_id,
            tipo_poliza: this.poliza.tipo_poliza
          });
        });
      },
      error: (error) => {
        console.error('Error fetching poliza:', error);
      }
    });
  }
  back() {
    this.router.navigate(['polizas/list'])
  }
  create() {
    // Sincronizar todos los campos del modelo con el FormGroup antes de validar
    this.theFormGroup.patchValue({
      seguro_id: this.poliza.seguro_id,
      maquina_id: this.poliza.maquina_id,
      operario_id: this.poliza.operario_id,
      tipo_poliza: this.poliza.tipo_poliza,
      fechaInicio: this.poliza.fechaInicio,
      fechaFin: this.poliza.fechaFin
    });
    this.theFormGroup.updateValueAndValidity();
    if (this.theFormGroup.invalid) {
      const errors = this.theFormGroup.errors;
      if (errors?.xor) {
        Swal.fire("Error", errors.xor, "error");
        return;
      }
      this.theFormGroup.markAllAsTouched();
      Swal.fire("Error", "Todos los campos obligatorios deben estar completos.", "error");
      return;
    }
    // Log solo al enviar
    const { operario_id, maquina_id, tipo_poliza } = this.theFormGroup.value;
    console.log('VALIDACIÓN POLIZA SUBMIT:', { operario_id, maquina_id, tipo_poliza });
    const payload = this.theFormGroup.value;
    this.somePoliza.create(payload).subscribe({
      next: (poliza) => {
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/polizas/list']);
      },
      error: (error) => {
        Swal.fire("Error", "No se pudo crear la póliza.", "error");
      }
    });
  }
  update() {
    // Sincronizar todos los campos del modelo con el FormGroup antes de validar
    this.theFormGroup.patchValue({
      seguro_id: this.poliza.seguro_id,
      maquina_id: this.poliza.maquina_id,
      operario_id: this.poliza.operario_id,
      tipo_poliza: this.poliza.tipo_poliza,
      fechaInicio: this.poliza.fechaInicio,
      fechaFin: this.poliza.fechaFin
    });
    this.theFormGroup.updateValueAndValidity();
    if (this.theFormGroup.invalid) {
      const errors = this.theFormGroup.errors;
      if (errors?.xor) {
        Swal.fire("Error", errors.xor, "error");
        return;
      }
      this.theFormGroup.markAllAsTouched();
      Swal.fire("Error", "Todos los campos obligatorios deben estar completos.", "error");
      return;
    }
    // Log solo al enviar
    const { operario_id, maquina_id, tipo_poliza } = this.theFormGroup.value;
    console.log('VALIDACIÓN POLIZA SUBMIT:', { operario_id, maquina_id, tipo_poliza });
    const payload = { ...this.poliza, ...this.theFormGroup.value };
    this.somePoliza.update(payload).subscribe({
      next: (poliza) => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/polizas/list']);
      },
      error: (error) => {
        Swal.fire("Error", "No se pudo actualizar la póliza.", "error");
      }
    });
  }
  delete(id: number) {
    console.log("Delete poliza with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está poliza que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.somePoliza.delete(id).
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

  // Utilidad para formatear fechas a yyyy-MM-dd
  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }
}

// Custom validator for XOR
function polizaXorValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const operario_id = group.get('operario_id')?.value;
    const maquina_id = group.get('maquina_id')?.value;
    // XOR
    if (operario_id && maquina_id) {
      return { xor: 'Solo uno de operario_id o maquina_id debe estar presente' };
    }
    if (!operario_id && !maquina_id) {
      return { xor: 'Debes ingresar un Operario o una Maquina' };
    }
    // Ya no se valida tipo_poliza
    return null;
  };
}
