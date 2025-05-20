import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCuotaComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { PayComponent } from './pay/pay.component';

const routes: Routes = [
  { path: 'list', component: ListCuotaComponent },
  { path: 'create', component: ManageComponent },
  { path: 'update/:id', component: ManageComponent },
  { path: 'view/:id', component: ManageComponent },
  { path: ':id/pay', component: PayComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuotasRoutingModule { }
