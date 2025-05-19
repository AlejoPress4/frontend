import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListMantenimientoComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';



@NgModule({
  declarations: [
    ListMantenimientoComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MantenimientoRoutingModule
  ]
})
export class MantenimientoModule {}