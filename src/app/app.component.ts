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
    console.log('this.board.fallingPiece.rotationPoint;', this.board.fallingPiece.rotationPoint);
  }
}
