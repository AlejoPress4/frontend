import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsRoutingModule } from './chats-routing.module';
import { ListChatComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';




@NgModule({
  declarations:[
    ListChatComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, ChatsRoutingModule]
})
export class ChatsModule {}