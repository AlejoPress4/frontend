import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListProcedimientoComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ProcedimientoRoutingModule } from './procedimiento-routing.module';


@NgModule({
  declarations: [
    ListProcedimientoComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProcedimientoRoutingModule,
    ReactiveFormsModule,
    RouterModule
  ],
})
export class ProcedimientoModule {}