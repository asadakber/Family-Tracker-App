import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteMemberPage } from './invite-member';

@NgModule({
  declarations: [
    InviteMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteMemberPage),
  ],
})
export class InviteMemberPageModule {}
