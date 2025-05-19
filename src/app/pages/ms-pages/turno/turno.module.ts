import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListTurnoComponent } from './list/list.component';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';
import { TurnoRoutingModule } from './turno-routing.module';



@NgModule({
  declarations:[
    ListTurnoComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, TurnoRoutingModule]
})
export class TurnoModule {}