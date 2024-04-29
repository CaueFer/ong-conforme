import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';
import { UiSwitchModule } from 'ngx-ui-switch';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';
import { HttpClientModule } from '@angular/common/http';
import { GerenciadorComponent } from './doacoes/gerenciador/gerenciador.component';
import { HistoricoComponent } from './doacoes/historico/historico.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { SingleHistoricoComponent } from './doacoes/single-historico/single-historico.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    GerenciadorComponent,
    HistoricoComponent,
    SingleHistoricoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    HttpClientModule,
    UIModule,
    WidgetModule,
    FullCalendarModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    PickerModule,
    BsDatepickerModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
    UiSwitchModule,
    NgxSkeletonLoaderModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    RouterModule,
    NgbModule,
  ],
  providers: [
    DatePipe,
    provideNgxMask(),
  ]
})
export class PagesModule { }
