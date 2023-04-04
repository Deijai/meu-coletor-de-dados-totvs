import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { HostRegisterPageRoutingModule } from './host-register-routing.module';

import { HostRegisterPage } from './host-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HostRegisterPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [HostRegisterPage]
})
export class HostRegisterPageModule {}
