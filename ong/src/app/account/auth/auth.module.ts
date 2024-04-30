import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { UIModule } from '../../shared/ui/ui.module';
import { Login2Component } from './login2/login2.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [Login2Component],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule.forRoot(),
    UIModule,
    AuthRoutingModule,
    CarouselModule
  ]
})
export class AuthModule { }
