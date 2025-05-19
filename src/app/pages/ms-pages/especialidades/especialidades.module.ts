import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EspecialidadesRoutingModule } from './especialidades-routing.module';
import { ListEspecialidadComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations:[
    ListEspecialidadComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, EspecialidadesRoutingModule]
})
export class EspecialidadesModule {}