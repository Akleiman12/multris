import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(BoardComponent, {static: false}) private board: BoardComponent;
  title = 'multris';

  start() {
    
  }

  finishGame() {

  }
}
