import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

const BOARD_HEIGHT = 30;
const BOARD_WIDTH = 12;

class Piece {

  boardPosition: number[];
  positionMatrix: number[][];
  matrixSize: number;

  constructor(mSize: number) {
    this.matrixSize = mSize;
    this.initMatrix();
    this.initPiece();
    this.initBoardPosition();
    console.log()
  }

  initMatrix() {
    this.positionMatrix = [];
    for (let i = 0; i < this.matrixSize; i++) {
      this.positionMatrix[i] = new Array(this.matrixSize);
      for (let j = 0; j < this.matrixSize; j++) {
        this.positionMatrix[i][j] = 0;
      }
    }
  }

  initPiece() {
    const positions: number[][] = [[2, 2]];
    this.positionMatrix[positions[0][0]][positions[0][1]] = 1;
    ForLoop: for (let i = 1; i < this.matrixSize; i++) {
      const selected = [...positions[Math.floor(Math.random() * positions.length)]];
      const growthDir = ['U', 'R', 'D', 'L'];
      do {
        const ele = growthDir.splice(Math.floor(Math.random() * growthDir.length), 1)[0];
        switch (ele) {
          case 'U':
            if (this.positionMatrix[selected[0] - 1] && this.positionMatrix[selected[0] - 1][selected[1]] === 0) {
              selected[0] = selected[0] - 1;
            }
            break;
          case 'R':
            if (this.positionMatrix[selected[0]] && this.positionMatrix[selected[0]][selected[1] + 1] === 0) {
              selected[1] = selected[1] + 1;
            }
            break;
          case 'D':
            if (this.positionMatrix[selected[0] + 1] && this.positionMatrix[selected[0] + 1][selected[1]] === 0) {
              selected[0] = selected[0] + 1;
            }
            break;
          case 'L':
            if (this.positionMatrix[selected[0]] && this.positionMatrix[selected[0]][selected[1] - 1] === 0) {
              selected[1] = selected[1] - 1;
            }
            break;
          default:
            continue ForLoop;
        }
      } while (this.positionMatrix[selected[0]][selected[1]] !== 0);

      positions.push(selected);
      this.positionMatrix[selected[0]][selected[1]] = 1;
    }
  }

  initBoardPosition() {
    this.boardPosition = [0, 0];
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
  }

  ngOnInit() {
    this.initMatrix();
    this.fallingPiece = new Piece(4);
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

  // HAY QUE MEJORAR ESTE METODO, SOLO PARA PRUEBA
  paintPiece() {
    const piecePosition: number[] = this.fallingPiece.boardPosition;
    for (let i = 0; i < this.fallingPiece.matrixSize; i++) {
      for (let j = 0; j < this.fallingPiece.matrixSize; j++) {
        if (this.fallingPiece.positionMatrix[i][j]) {
          this.boardMatrix[piecePosition[0] + i][piecePosition[1] + j] = 1;
        }
      }
    }
  }

  // dev-tests ==========================================================================

  regenPiece() {
    this.initMatrix();
    this.fallingPiece = new Piece(4);
    this.paintPiece();
  }
}
