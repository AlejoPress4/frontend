import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListObraComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ObraRoutingModule } from './obra-routing.module';



@NgModule({
  declarations:[
    ListObraComponent,
    ManageComponent,
  ],
  imports:[CommonModule, FormsModule, ObraRoutingModule, ReactiveFormsModule]
})
export class ObraModule {}