import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListMaquinaComboComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { MaquinaComboRoutingModule } from './maquinacombo-routing.module';



@NgModule({
  declarations: [
    ListMaquinaComboComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaquinaComboRoutingModule
   ]
})
export class MaquinaComboModule {}