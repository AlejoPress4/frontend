import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentosRoutingModule } from './departamentos-routing.module';
import { ListComponent } from './list/list.component';
import { NbCardModule } from '@nebular/theme';


@NgModule({
  declarations: [
    ListComponent,

  ],
  imports: [
    CommonModule,
    DepartamentosRoutingModule,
    NbCardModule
  ]
})
export class DepartamentosModule { }
