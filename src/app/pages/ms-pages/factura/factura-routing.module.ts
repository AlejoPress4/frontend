import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa tus componentes de listado y manejo para las facturas
// NOTA: Usamos ListBillComponent basado en el error anterior.
// Asumimos que tu componente para crear/editar/ver se llama ManageComponent
import { ListFacturaComponent } from './list/list.component';
import { ManageFacturaComponent } from './manage/manage.component'; // Asegúrate de la ruta correcta si tu componente se llama diferente

const routes: Routes = [
  // Ruta por defecto: redirige a la lista de facturas
  { path: '', redirectTo: 'list', pathMatch: 'full' },

  // Ruta para listar todas las facturas
  { path: 'list', component: ListFacturaComponent },

  // Ruta para crear una nueva factura
  { path: 'create', component: ManageFacturaComponent },

  // Ruta para actualizar una factura específica por su ID
  { path: 'update/:id', component: ManageFacturaComponent }, // ':id' es un parámetro de ruta

  // Ruta para ver los detalles de una factura específica por su ID
  { path: 'view/:id', component: ManageFacturaComponent }, // ':id' es un parámetro de ruta
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaRoutingModule { }