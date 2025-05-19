import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSeguroComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


const routes: Routes = [
  { path: 'list', component: ListSeguroComponent },
  { path: 'create', component: ManageComponent },
  { path: 'update/:id', component: ManageComponent },
  { path: 'delete/:id', component: ManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguroRoutingModule { }
