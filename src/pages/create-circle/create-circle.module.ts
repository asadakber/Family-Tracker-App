import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateCirclePage } from './create-circle';

@NgModule({
  declarations: [
    CreateCirclePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateCirclePage),
  ],
})
export class CreateCirclePageModule {}
