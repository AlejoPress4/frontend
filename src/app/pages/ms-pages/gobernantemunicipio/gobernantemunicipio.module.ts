import { NgModule } from '@angular/core';
import { GobernanteMunicipioRoutingModule } from './gobernantemunicipio-routing.module';
import { ManageComponent } from './manage/manage.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListGobernanteMunicipioComponent } from './list/list.component';



@NgModule({
  declarations: [
    ListGobernanteMunicipioComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GobernanteMunicipioRoutingModule
  ]
})
export class GobernanteMunicipioModule {}