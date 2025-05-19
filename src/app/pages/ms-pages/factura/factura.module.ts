import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaRoutingModule } from './factura-routing.module';
import { ListFacturaComponent } from './list/list.component';
import { ManageFacturaComponent } from './manage/manage.component';

@NgModule({
  declarations: [
    ListFacturaComponent,
    ManageFacturaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FacturaRoutingModule
  ]
})
export class FacturaModule { }