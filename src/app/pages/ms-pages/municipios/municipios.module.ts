import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MunicipiosRoutingModule } from './municipios-routing.module';
import { ListComponent } from './list/list.component';
import { NbCardModule } from '@nebular/theme';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    MunicipiosRoutingModule,
    NbCardModule
  ]
})
export class MunicipiosModule { }
