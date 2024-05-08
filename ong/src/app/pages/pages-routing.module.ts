import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GerenciadorComponent } from './doacoes/gerenciador/gerenciador.component';
import { HistoricoComponent } from './doacoes/historico/historico.component';
import { SingleHistoricoComponent } from './doacoes/single-historico/single-historico.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FamilyDashboardComponent } from './familias/family-dashboard/family-dashboard.component';
import { SingleFamilyComponent } from './familias/single-family/single-family.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gerenciador', component: GerenciadorComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: 'historico-single', component: SingleHistoricoComponent },
  { path: 'familia-dashboard', component: FamilyDashboardComponent },
  { path: 'familia-unic-dashboard', component: SingleFamilyComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
