import { NgModule } from '@angular/core';
import { ListServicioComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicioRoutingModule } from './servicio-routing.module';



@NgModule({
  declarations: [
    ListServicioComponent,
    ManageComponent

  ],
  imports: [CommonModule, FormsModule, ServicioRoutingModule, ReactiveFormsModule]
})
export class ServicioModule { }