import { Component, OnInit } from '@angular/core';
import { Piece } from '../piece/piece.component';

const BOARD_HEIGHT = 16;
const BOARD_WIDTH = 8;
const INITIAL_PIECE_SIZE = 4;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  boardMatrix: number[][]; // [y][x] con eje (0,0) en esquina superior izquierda - Valores: (1) Ocupado (0) Vacio
  fallingPiece: Piece;
  fallingPiecePosition : number[];
  boardProportion: number;
  entryPoint: number[];
  tickerInterval: number;
  MIP: boolean //Movement In Process
  MIPTimeoutId: any;
  priorKey

  constructor() {}

  ngOnInit() {
    this.boardProportion = BOARD_WIDTH / BOARD_HEIGHT;
    this.initBoardMatrix();
    this.initPiece();
    this.initTicker();
  }

  initBoardMatrix() {
    this.boardMatrix = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      this.boardMatrix[i] = new Array(BOARD_WIDTH);
      for (let j = 0; j < BOARD_WIDTH; j++) {
        this.boardMatrix[i][j] = 0;
      }
    }
    this.entryPoint = [0, Math.round(BOARD_WIDTH / 2) - 1];
  }

  initPiece() {
    this.fallingPiece = new Piece(INITIAL_PIECE_SIZE);
    this.fallingPiecePosition = this.entryPoint;
    this.paintPiece();
  }

  initTicker(){
    this.tickerInterval = this.tickerInterval ? this.tickerInterval : 1000;
    this.eventSetter();
    setTimeout(this.tick.bind(this), this.tickerInterval);

  }

  

  tick() {
    this.movePiece({ code: 'KeyS' })
    setTimeout(this.tick.bind(this), this.tickerInterval);
  }

  paintPiece() {
    const piecePosition: number[] = this.fallingPiecePosition;
    console.log(this.fallingPiece.pieceMatrix);
    for (let i = 0; i < this.fallingPiece.pieceMatrix.length; i++) {
      for (let j = 0; j < this.fallingPiece.pieceMatrix[i].length; j++) {
        if (this.fallingPiece.pieceMatrix[i][j]) {
          this.boardMatrix[piecePosition[0] + i][piecePosition[1] + j] = 1;
        }
      }
    }
  }

  movePiece(event) {
    if(!this.MIP || event.code !== this.priorKey){
      if (this.MIPTimeoutId) {
        clearTimeout(this.MIPTimeoutId)
        this.MIPTimeoutId = null;
      } else {
        this.MIP = true;
      }
      console.log('moving triggered', event)
      this.priorKey = event.code;
      switch(event.code){
        case 'KeyA':
          this.fallingPiecePosition[1] -= 1;
          break;
        case 'KeyS':
          this.fallingPiecePosition[0] += 1;
          break;
        case 'KeyD':
          this.fallingPiecePosition[1] += 1;
          break;
        case 'KeyW':
          this.fallingPiece.rotatePiece();
          break;
      }
      this.initBoardMatrix();
      this.paintPiece();
      this.MIPTimeoutId = setTimeout(() => {
        this.MIP = false;
        this.MIPTimeoutId = null;
      }, 500);
    }
  }

  eventSetter() {
    addEventListener('keydown', this.movePiece.bind(this))
    addEventListener('keyup', (event) => {
      if (event.keyCode !== this.priorKey) {
        this.MIP = false;
        if (this.MIPTimeoutId) {
          clearTimeout(this.MIPTimeoutId)
          this.MIPTimeoutId = null;
        }
      }
    })
  }

  // dev-tests ==========================================================================

  regenPiece() {
    this.initBoardMatrix();
    this.fallingPiecePosition = this.entryPoint;
    this.fallingPiece = new Piece(INITIAL_PIECE_SIZE);
    this.paintPiece();
  }
  //

}
