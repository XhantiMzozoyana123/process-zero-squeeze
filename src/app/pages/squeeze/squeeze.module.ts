import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SqueezePageRoutingModule } from './squeeze-routing.module';

import { SqueezePage } from './squeeze.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SqueezePageRoutingModule,
  ],
  declarations: [SqueezePage],
})
export class SqueezePageModule {}