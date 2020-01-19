import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

const BOARD_HEIGHT = 30;
const BOARD_WIDTH = 12;

class Piece {
  positionMatrix: number[][];
  matrixSize: number;

  constructor(mSize: number) {
    this.matrixSize = mSize;
    this.initMatrix();
  }

  initMatrix() {
    this.positionMatrix = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      this.positionMatrix[i] = new Array(BOARD_WIDTH);
      for (let j = 0; j < BOARD_WIDTH; j++) {
        this.positionMatrix[i][j] = 0;
      }
    }
  }

  initPiece() {
    let positions: number[][] = [];
    positions[0] = [Math.floor(this.matrixSize / 2), Math.floor(this.matrixSize / 2)];
    this.positionMatrix[positions[0][0]][positions[0][1]] = 1;
    for (let i = 0; i < this.matrixSize; i++) {
      let selected = positions[Math.floor(Math.random() * positions.length)];
      let growthDir = ['U', 'R', 'D', 'L'];
      do {
        switch(growthDir){
          case 'U':
            selected[0] = selected[0] - 1;
            break;
          case 'R':
            selected[1] = selected[1] + 1;
            break;
          case 'D':
            selected[0] = selected[0] + 1;
            break;
          case 'L':
            selected[1] = selected[1] - 1;
            break;
          default:
            throwError('Error with growthDir');
        }
      } while (this.positionMatrix[selected[0]][selected[1]] !== 0);
      
    }
  }

  genNum = (n?) => Math.floor(Math.random() * (n ? n : this.matrixSize));
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  boardMatrix: number[][]; // [y][x] con eje (0,0) en esquina superior izquierda
  fallingPiece: Piece;
  constructor() {
    let fake = new Piece(4);
    console.log(fake);
  }

  ngOnInit() {
    this.initMatrix();
  }

  initMatrix() {
    this.boardMatrix = [];
    for(let i = 0; i < BOARD_HEIGHT; i++) {
      this.boardMatrix[i] = new Array(BOARD_WIDTH);
      for(let j = 0; j < BOARD_WIDTH; j++) {
        this.boardMatrix[i][j] = 0;
      }
    }

    console.log(this.boardMatrix);
  }

}
