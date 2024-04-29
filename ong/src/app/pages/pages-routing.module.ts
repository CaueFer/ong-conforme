import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { GerenciadorComponent } from './doacoes/gerenciador/gerenciador.component';
import { HistoricoComponent } from './doacoes/historico/historico.component';
import { SingleHistoricoComponent } from './doacoes/single-historico/single-historico.component';

const routes: Routes = [
  { path: 'dashboard', component: DefaultComponent },
  { path: 'gerenciador', component: GerenciadorComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: 'historico-single', component: SingleHistoricoComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
