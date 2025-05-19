import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GobernanteRoutingModule } from './gobernante-routing.module';
import { ListGobernanteComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';



@NgModule({
  declarations: [
    ListGobernanteComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GobernanteRoutingModule
  ]
})
export class GobernanteModule { }