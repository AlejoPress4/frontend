import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListNovedadComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { NovedadRoutingModule } from './novedad-routing.module';



@NgModule({
  declarations:[
    ListNovedadComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, NovedadRoutingModule, ReactiveFormsModule]
})
export class NovedadModule {}