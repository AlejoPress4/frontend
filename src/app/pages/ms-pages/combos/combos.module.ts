import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CombosRoutingModule } from './combos-routing.module';
import { ListComboComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: 'list', component: ListComboComponent },
  { path: 'manage', component: ManageComponent },
];

@NgModule({
  declarations: [
    ListComboComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CombosRoutingModule
  ],
  exports: [RouterModule]
})
export class CombosModule { }
