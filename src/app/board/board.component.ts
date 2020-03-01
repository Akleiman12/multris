import { Component, OnInit } from '@angular/core';
import { Piece } from '../piece/piece.component';
import { throwError } from 'rxjs';

const BOARD_HEIGHT = 16;
const BOARD_WIDTH = 8;
const INITIAL_PIECE_SIZE = 6;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  boardMatrix: number[][]; // [y][x] con eje (0,0) en esquina superior izquierda
  fallingPiece: Piece;
  boardProportion: number;

  constructor() {}

  ngOnInit() {
    this.boardProportion = BOARD_WIDTH / BOARD_HEIGHT;
    this.initMatrix();
    this.fallingPiece = new Piece(INITIAL_PIECE_SIZE);
    this.paintPiece();
  }

  initMatrix() {
    this.boardMatrix = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      this.boardMatrix[i] = new Array(BOARD_WIDTH);
      for (let j = 0; j < BOARD_WIDTH; j++) {
        this.boardMatrix[i][j] = 0;
      }
    }
  }

  paintPiece() {
    const piecePosition: number[] = this.fallingPiece.boardPosition;
    for (let i = 0; i < this.fallingPiece.matrixSize; i++) {
      for (let j = 0; j < this.fallingPiece.matrixSize; j++) {
        if (this.fallingPiece.pieceMatrix[i][j]) {
          this.boardMatrix[piecePosition[0] + i][piecePosition[1] + j] = 1;
        }
      }
    }
  }

  // dev-tests ==========================================================================

  regenPiece() {
    this.initMatrix();
    this.fallingPiece = new Piece(INITIAL_PIECE_SIZE);
    this.paintPiece();
  }
  //
  tick(){
    
  }

  movePiece(direction: string) {
    const height = this.fallingPiece.pieceMatrix.length;
    const width = this.fallingPiece.pieceMatrix[0].length;
    if(this.checkForBlocks)
    for (let i = 0; i < height; i++) {
      for (let j = 0; i < width; j++) {
        
      }
    }
  }

  checkForBlocks(direction) {

  }
}
