import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CuotasRoutingModule } from './cuotas-routing.module';
import { ListCuotaComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { PayComponent } from './pay/pay.component';

@NgModule({
  declarations: [
    ListCuotaComponent,
    ManageComponent,
    PayComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CuotasRoutingModule]
})
export class CuotasModule { }