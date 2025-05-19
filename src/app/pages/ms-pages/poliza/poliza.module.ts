import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListPolizaComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { PolizaRoutingModule } from './poliza-routing.module';



@NgModule({
  declarations: [
    ListPolizaComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PolizaRoutingModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [RouterModule]
})
export class PolizaModule { }