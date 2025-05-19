import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CuotasRoutingModule } from './cuotas-routing.module';
import { ListCuotaComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';




@NgModule({
  declarations:[
    ListCuotaComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, CuotasRoutingModule]
})
export class CuotasModule {}