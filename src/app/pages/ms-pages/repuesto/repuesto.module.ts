import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ManageComponent } from './manage/manage.component';
import { RepuestoRoutingModule } from './repuesto-routing.module';



@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [CommonModule, FormsModule, RepuestoRoutingModule]
})
export class RepuestoModule { }