import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListProcedimientoMantenimientoComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ProcedimientoMantenimientoRoutingModule } from './procedimientomantenimiento-routing.module';



@NgModule({
  declarations: [
    ListProcedimientoMantenimientoComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProcedimientoMantenimientoRoutingModule,
    ReactiveFormsModule,
    RouterModule
  ],
})
export class ProcedimientoMantenimientoModule {}