import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EspecialidadMaquinariaRoutingModule } from './especialidadmaquinaria-routing.module';
import { ListEspecialidadMaquinariaComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';




@NgModule({
  declarations:[
    ListEspecialidadMaquinariaComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, EspecialidadMaquinariaRoutingModule]
})
export class EspecialidadMaquinariaModule {}