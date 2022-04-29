import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'client';

  constructor(
    public wsService: WebsocketService,
    public chatService: ChatService
  ){}

  ngOnInit(): void {
      this.chatService.getMessagesPrivate().subscribe( msg => {
        console.log(msg);
      })
  }

}
