import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GobernanteDepartamentoRoutingModule } from './gobernantedepartamento-routing.module';
import { ListGobernanteDepartamentoComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';



@NgModule({
  declarations: [
    ListGobernanteDepartamentoComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GobernanteDepartamentoRoutingModule
  ]
})
export class GobernanteDepartamentoModule {}