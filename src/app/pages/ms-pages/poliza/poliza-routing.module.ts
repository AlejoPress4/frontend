import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Importa los componentes solo para usarlos en la definición de rutas
import { ListPolizaComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

// Define las rutas específicas de la característica "poliza"
const routes: Routes = [
  { path: 'list', component: ListPolizaComponent },
  { path: 'create', component: ManageComponent },
  { path: 'update/:id', component: ManageComponent },
  { path: 'view/:id', component: ManageComponent },
  // Puedes añadir una ruta por defecto, por ejemplo, redirigir '' a 'list'
  // { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  // --- MODIFICACIÓN ---
  // Elimina declarations, CommonModule y FormsModule
  imports: [
    RouterModule.forChild(routes) // Solo importa el RouterModule configurado
  ],
  // --- FIN MODIFICACIÓN ---
  exports: [RouterModule] // Exporta el RouterModule para que el módulo principal lo importe
})
export class PolizaRoutingModule { }