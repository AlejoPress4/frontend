import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HasPermissionDirective } from '../directives/has-permission.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule
  ],  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    HasPermissionDirective
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    HasPermissionDirective
  ]
})
export class ComponentsModule { }
