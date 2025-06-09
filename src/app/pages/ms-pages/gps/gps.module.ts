import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { GpsRoutingModule } from './gps-routing.module';
import { ListGpsComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';



@NgModule({
  declarations: [
    ListGpsComponent,
    ManageComponent
  ],  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule,
    GpsRoutingModule
  ]
})
export class GpsModule {}