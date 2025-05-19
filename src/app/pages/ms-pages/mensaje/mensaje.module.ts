import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMensajeComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MensajeRoutingModule } from './mensaje-routing.module';



@NgModule({
  declarations:[
    ListMensajeComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, MensajeRoutingModule, ReactiveFormsModule]
})
export class MensajeModule {}