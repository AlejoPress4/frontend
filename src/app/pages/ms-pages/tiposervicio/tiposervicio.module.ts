import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTipoServicioComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoServicioRoutingModule } from './tiposervicio-routing.module';



@NgModule({
  declarations:[
    ListTipoServicioComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, ReactiveFormsModule, TipoServicioRoutingModule]
})

export class TipoServicioModule {}