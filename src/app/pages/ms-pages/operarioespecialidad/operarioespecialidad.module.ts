import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperarioEspecialidadRoutingModule } from './operarioespecialidad-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListOperarioEspecialidadComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';



@NgModule({
  declarations: [
    ListOperarioEspecialidadComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    OperarioEspecialidadRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [RouterModule]
})
export class OperarioEspecialidadModule {}