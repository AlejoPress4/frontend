import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { TokenInterceptor } from './interceptores/token.interceptor';
import { AutenticadoGuard } from './guardianes/autenticado.guard';
import { AdminGuard } from './guardianes/admin.guard';
import { OperarioGuard } from './guardianes/operario.guard';
import { GobernanteGuard } from './guardianes/gobernante.guard';
import { RoleGuard } from './guardianes/role.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ForgotPasswordComponent
  ],  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AutenticadoGuard,
    AdminGuard,
    OperarioGuard,
    GobernanteGuard,
    RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }