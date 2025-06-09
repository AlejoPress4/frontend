import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evidencia } from 'src/app/models/evidencia.model';
import { Servicio } from 'src/app/models/servicio.model';
import { Novedad } from 'src/app/models/novedad.model';
import { EvidenciaService } from 'src/app/services/evidenciaService/evidencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; //1->View, 2->Create, 3-> Update
  evidencia: Evidencia;
  servicios: Servicio[] = [];
  novedades: Novedad[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;  currentImageUrl: string | null = null; // For displaying existing images
  associationType: 'servicio' | 'novedad' = 'servicio';
  isUploading: boolean = false;
  
  // Form helper properties for selectors (since model uses arrays but form needs IDs)
  selectedServicioId: number | null = null;
  selectedNovedadId: number | null = null;

  // Validation properties
  readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  readonly allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  constructor(private activateRoute: ActivatedRoute,
    private evidenciaService: EvidenciaService,
    private router: Router
  ) {
    this.evidencia = { id: 0 };
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
    
    // Load dropdown data
    this.loadServicios();
    this.loadNovedades();
    
    if (this.activateRoute.snapshot.params.id) {
      this.evidencia.id = this.activateRoute.snapshot.params.id;
      this.getEvidencia(this.evidencia.id);
    }
  }

  loadServicios(): void {
    this.evidenciaService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
      },
      error: (error) => {
        console.error('Error loading servicios:', error);
      }
    });
  }

  loadNovedades(): void {
    this.evidenciaService.getNovedades().subscribe({
      next: (novedades) => {
        this.novedades = novedades;
      },
      error: (error) => {
        console.error('Error loading novedades:', error);
      }
    });
  }  getEvidencia(id: number) {
    this.evidenciaService.view(id).subscribe({
      next: (evidencia) => {
        this.evidencia = evidencia;
        // Set image URL for display
        if (this.evidencia.id) {
          this.currentImageUrl = this.evidenciaService.getPhotoUrl(this.evidencia.id);
        }
        console.log('Evidencia fetched successfully:', this.evidencia);
      },
      error: (error) => {
        console.error('Error fetching evidencia:', error);
        Swal.fire('Error', 'No se pudo obtener la evidencia.', 'error');
      }
    });
  }// File handling methods
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!this.validateFile(file)) {
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  validateFile(file: File): boolean {
    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      Swal.fire('Error', 'Tipo de archivo no permitido. Solo se permiten: JPG, JPEG, PNG, GIF, WEBP', 'error');
      return false;
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      Swal.fire('Error', 'El archivo es demasiado grande. Tamaño máximo: 5MB', 'error');
      return false;
    }

    return true;
  }  onAssociationTypeChange(): void {
    // XOR enforcement: Clear the other association when switching types
    if (this.associationType === 'servicio') {
      this.evidencia.novedad_id = undefined; // Clear novedad selection
      this.selectedNovedadId = null;
    } else if (this.associationType === 'novedad') {
      this.evidencia.id_servicio = undefined; // Clear servicio selection
      this.selectedServicioId = null;
    }
  }

  onServicioChange(): void {
    if (this.selectedServicioId) {
      const servicio = this.servicios.find(s => s.id === this.selectedServicioId);
      this.evidencia.id_servicio = servicio ? [servicio] : undefined;
    } else {
      this.evidencia.id_servicio = undefined;
    }
  }

  onNovedadChange(): void {
    if (this.selectedNovedadId) {
      const novedad = this.novedades.find(n => n.id === this.selectedNovedadId);
      this.evidencia.novedad_id = novedad ? [novedad] : undefined;
    } else {
      this.evidencia.novedad_id = undefined;
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  back() {
    this.router.navigate(['evidencias/list']);
  }
  create() {
    if (!this.validateEvidencia()) {
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    if (this.mode === 2 && this.selectedFile) {
      // Upload with file
      this.uploadWithFile();
    } else {
      // Regular create without file
      this.evidenciaService.create(this.evidencia).subscribe({
        next: (evidencia) => {
          console.log('Evidencia created successfully:', evidencia);
          Swal.fire({
            title: 'Creado!',
            text: 'Registro creado correctamente.',
            icon: 'success',
          }).then(() => {
            this.router.navigate(['/evidencias/list']);
          });
        },
        error: (error) => {
          console.error('Error creating evidencia:', error);
          Swal.fire('Error', 'No se pudo crear el registro.', 'error');
        }
      });
    }
  }  uploadWithFile(): void {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Por favor seleccione un archivo.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', this.selectedFile); // Backend expects 'imagen'
    
    // Add association based on type using helper properties (XOR validation)
    if (this.associationType === 'servicio' && this.selectedServicioId) {
      formData.append('id_servicio', this.selectedServicioId.toString());
    } else if (this.associationType === 'novedad' && this.selectedNovedadId) {
      formData.append('novedad_id', this.selectedNovedadId.toString());
    } else {
      Swal.fire('Error', 'Debe seleccionar un servicio o una novedad.', 'error');
      return;
    }

    this.isUploading = true;
    this.evidenciaService.upload(formData).subscribe({
      next: (evidencia) => {
        this.isUploading = false;
        console.log('Evidencia uploaded successfully:', evidencia);
        Swal.fire({
          title: 'Subido!',
          text: 'Imagen subida correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/evidencias/list']);
        });
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Error uploading evidencia:', error);
        Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
      }
    });
  }

  update() {
    if (!this.validateEvidencia()) {
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    this.evidenciaService.update(this.evidencia).subscribe({
      next: (evidencia) => {
        console.log('Evidencia updated successfully:', evidencia);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/evidencias/list']);
        });
      },
      error: (error) => {
        console.error('Error updating evidencia:', error);
        Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
      }
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que quiere eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.evidenciaService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.router.navigate(['/evidencias/list']);
          },
          error: (error) => {
            console.error('Error al eliminar la evidencia:', error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }  private validateEvidencia(): boolean {
    // XOR validation using the helper properties
    const hasServicio = this.associationType === 'servicio' && this.selectedServicioId !== null;
    const hasNovedad = this.associationType === 'novedad' && this.selectedNovedadId !== null;
    
    // Must have exactly one association (XOR)
    const isValidAssociation = (hasServicio && !hasNovedad) || (!hasServicio && hasNovedad);
    
    if (!isValidAssociation) {
      Swal.fire('Error', 'Una evidencia debe estar asociada a UN servicio O a UNA novedad (no ambos ni ninguno).', 'error');
      return false;
    }
    
    // For upload mode, also need file
    if (this.mode === 2 && !this.selectedFile) {
      Swal.fire('Error', 'Debe seleccionar un archivo de imagen.', 'error');
      return false;
    }

    return true;
  }// Helper methods for template
  getServicioName(servicioArray: Servicio[] | number | null): string {
    if (Array.isArray(servicioArray) && servicioArray.length > 0) {
      return servicioArray[0].resumen || `Servicio ${servicioArray[0].id}`;
    } else if (typeof servicioArray === 'number') {
      const servicio = this.servicios.find(s => s.id === servicioArray);
      return servicio?.resumen || `Servicio ${servicioArray}`;
    }
    return 'No asignado';
  }

  getNovedadName(novedadArray: Novedad[] | number | null): string {
    if (Array.isArray(novedadArray) && novedadArray.length > 0) {
      return novedadArray[0].descripcion || `Novedad ${novedadArray[0].id}`;
    } else if (typeof novedadArray === 'number') {
      const novedad = this.novedades.find(n => n.id === novedadArray);
      return novedad?.descripcion || `Novedad ${novedadArray}`;
    }
    return 'No asignado';
  }
}
