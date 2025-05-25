import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListSeguroComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SeguroRoutingModule } from './seguro-routing.module';

@NgModule({
  declarations: [
    ListSeguroComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SeguroRoutingModule
  ]
})
export class SeguroModule {}