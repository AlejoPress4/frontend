import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ListMaquinaComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { MaquinaRoutingModule } from './maquina-routing.module';




@NgModule({
  declarations: [
    ListMaquinaComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaquinaRoutingModule
  ]
})
export class MaquinaModule {}