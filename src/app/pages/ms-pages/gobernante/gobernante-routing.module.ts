import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListGobernanteComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


const routes: Routes = [
  { path: 'list', component: ListGobernanteComponent },
  { path: 'create', component: ManageComponent },
  { path: 'update/:id', component: ManageComponent },
  { path: 'view/:id', component: ManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GobernanteRoutingModule { }
