import { Routes } from '@angular/router';
import { NoAutenticadoGuard } from '../../guardianes/no-autenticado.guard';
import { ForgotPasswordComponent } from '../../pages/forgot-password/forgot-password.component';
import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [NoAutenticadoGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [NoAutenticadoGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NoAutenticadoGuard] }
];
