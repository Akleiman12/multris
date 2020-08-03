import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Piece } from '../piece/piece.component';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

const BOARD_HEIGHT = 16;
const BOARD_WIDTH = 8;
const INITIAL_PIECE_SIZE = 4;
const COLORS = ['yellow','green','blue','red'];

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  // Board and Piece Related Properties
  boardMatrix: Array<number | string>[]; // [y][x] con eje (0,0) en esquina superior izquierda - Valores: (1) Ocupado (0) Vacio
  boardProportion: number; // Float with the numeric proportion of the board (Width/Height)
  entryPoint: number[]; // New piece's entry point into boardMatrix
  fallingPiece: Piece; // Piece currently in motion
  fallingPiecePosition : number[]; // [y, x] Position of fallingPiece inside boardMatrix
  nextPiece: Piece;
  points: number;
  level: number;
  nextLevel: number;
  nextPieceContainer: Array<number | string>[];
  
  // Config Related Properties
  tickerInterval: number; // Time interval between ticks (ms)
  nextTick: any;
  
  // Movement Related Properties
  MIP: boolean // Movement In Process Flag
  MIPTimeoutId: any; // Id of setTimeout function for movement blocking
  priorKey: any; // Code of prior key to compare and allow movement
  
  // Game Management
  gameOverFlag: boolean;
  stop: boolean;
  resume: any;
  
  constructor() {}

  ngOnInit() {
    this.boardProportion = BOARD_WIDTH / BOARD_HEIGHT;
    this.nextLevel = 1;
    this.level = 0;
    this.points = 0;
    this.initBoardMatrix();
    this.initPiece();
    this.initTicker();
  }

  initBoardMatrix() {
    this.boardMatrix = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      this.boardMatrix[i] = this.createRow();
    }
    this.entryPoint = [0, Math.round(BOARD_WIDTH / 2) - 1];
  }

  createRow(value: string | number = 0) {
    let row = new Array(BOARD_WIDTH);
      for (let i = 0; i < BOARD_WIDTH; i++) {
        row[i] = value;
      }
      return row;
  }

  initPiece() {
    if(!this.nextPiece) {
      this.nextPiece =  new Piece(INITIAL_PIECE_SIZE + this.level, COLORS[Math.floor(Math.random() * (COLORS.length))]);
    }
    this.fallingPiece = this.nextPiece;
    this.nextPiece =  new Piece(INITIAL_PIECE_SIZE + this.level, COLORS[Math.floor(Math.random() * (COLORS.length))]);
    this.nextPieceContainer = this.formatNextPiece()
    console.log(this.nextPiece)
    this.fallingPiecePosition = this.entryPoint;
    this.paintPiece();
  }

  initTicker(){
    this.tickerInterval = this.tickerInterval ? this.tickerInterval : 1000;
    this.eventSetter();
    this.nextTick = setTimeout(this.tick.bind(this), this.tickerInterval);
    console.log("actualMatrix",this.boardMatrix)
  }

  cleanBoardCurrentPiece() {
    this.recalcBoardMatrix(-1);
  }

  fixPieceOnBoard() {
    this.recalcBoardMatrix(1);
    for (let i of this.boardMatrix.keys()) {
      for (let j of this.boardMatrix[i].keys()) {
        if(this.boardMatrix[i][j] == 2) {
          this.boardMatrix[i][j] = this.fallingPiece.color;
        }
      }
    }
  }

  checkForLines(){
    return new Promise( (resolve) => {
      let rowToClean = [];
      for (let [index, row] of this.boardMatrix.entries()) {
        let aux = row.findIndex((val) => typeof val === 'number');
        if (aux === -1) {
          rowToClean.push(index);
        }
      }
      if(rowToClean.length){
        console.log("POINTS: +", rowToClean.length);
        for(let index of rowToClean) {
          this.boardMatrix[index] = this.createRow('white');
        }
        this.points += rowToClean.length;
        setTimeout(() => {
          for(let index of rowToClean) {
            this.boardMatrix[index] = this.createRow();
          }          
        }, 500)
        setTimeout(() => {
          for(let index of rowToClean) {
            delete this.boardMatrix[index];
            this.boardMatrix = [this.createRow(), ...this.boardMatrix.filter((row) => row !== undefined) ];
          }
          // Recalc Level
          this.level = Math.floor(this.points / 2);
          resolve();
        }, 1000)
      } else {
        console.log('NO POINTS');
        resolve();
      }
    })
  }

  async tick() {
    if(!this.stop){
      const bottomCollision = this.detectBoardCollision([this.fallingPiecePosition[0] + 1, this.fallingPiecePosition[1]], this.fallingPiece.pieceMatrix)
      // Check for boarder collision
      // Check for cell collision
      // If true && (non-lateral-collision) => quit nextTick & initNewPiece
      // If false => continue to nextTick
      if(bottomCollision) {
        this.fixPieceOnBoard();
        await this.checkForLines()
        this.initPiece();
        this.initTicker();
      } else {
        this.movePiece({ code: 'KeyS' });
        this.nextTick = setTimeout(this.tick.bind(this), this.tickerInterval);
      }
    }
  }

  paintPiece() {
    const piecePosition: number[] = this.fallingPiecePosition;
    if (this.checkInitArea()){
      for (let i = 0; i < this.fallingPiece.pieceMatrix.length; i++) {
        for (let j = 0; j < this.fallingPiece.pieceMatrix[i].length; j++) {
          if(this.fallingPiece.pieceMatrix[i][j] === 1)
            this.boardMatrix[piecePosition[0] + i][piecePosition[1] + j] = this.fallingPiece.pieceMatrix[i][j];
        }
      }
    } else {
      this.gameOver();
    }
  }


  // ESTA FUNCION TIENE UN PROBLEMA
  formatNextPiece() {
    let matrixPiece = [];
    for (let i = 0; i < (INITIAL_PIECE_SIZE + this.level); i++) {
      matrixPiece.push(new Array(INITIAL_PIECE_SIZE + this.level));
      for (let j = 0; j < (INITIAL_PIECE_SIZE + this.level); j++) {
        matrixPiece[i][j] = 0;
      }
    }
    console.log(1,matrixPiece)
    let insertPoint = [Math.floor((INITIAL_PIECE_SIZE + this.level) / 2) - Math.floor(this.nextPiece.pieceMatrix.length / 2), Math.floor((INITIAL_PIECE_SIZE + this.level) / 2) - Math.floor(this.nextPiece.pieceMatrix[0].length / 2)];
    
    for (let i = 0; i < (this.nextPiece.pieceMatrix.length); i++) {
      for (let j = 0; j < (this.nextPiece.pieceMatrix[i].length); j++) {
        matrixPiece[insertPoint[0] + i][insertPoint[1] + j] = this.nextPiece.pieceMatrix[i][j];
      }
    }
    console.log(2,matrixPiece)
    return matrixPiece;
  }

  checkInitArea() {
    for(let [i, row] of this.fallingPiece.pieceMatrix.entries()) {
      for(let [j, cell] of row.entries()) {
        if (cell !== 0 && this.boardMatrix[i+this.fallingPiecePosition[0]][j+this.fallingPiecePosition[1]] !== 0) {
          return false;
        }
      }
    }
    return true;
  }

  movePiece(event) {
    if(!this.MIP || event.code !== this.priorKey){
      if (this.MIPTimeoutId) {
        clearTimeout(this.MIPTimeoutId)
        this.MIPTimeoutId = null;
      } else {
        this.MIP = true;
      }
      let newPosition = JSON.parse(JSON.stringify(this.fallingPiecePosition));
      let futurePieceMatrix;
      this.priorKey = event.code;
      switch(event.code){
        case 'KeyA':
          newPosition[1] -= 1;
          futurePieceMatrix = JSON.parse(JSON.stringify(this.fallingPiece.pieceMatrix));
          break;
        case 'KeyS':
          newPosition[0] += 1;
          futurePieceMatrix = JSON.parse(JSON.stringify(this.fallingPiece.pieceMatrix));
          break;
        case 'KeyD':
          newPosition[1] += 1;
          futurePieceMatrix = JSON.parse(JSON.stringify(this.fallingPiece.pieceMatrix));
          break;
        case 'KeyW':
          futurePieceMatrix = this.fallingPiece.rotatePiece();
          break;
        default:
          this.MIP = false;
          this.MIPTimeoutId = null;
          return
      }
      if (!this.detectBoardCollision(newPosition, futurePieceMatrix)) {
        this.cleanBoardCurrentPiece();
        this.fallingPiece.pieceMatrix = futurePieceMatrix;
        this.fallingPiecePosition = newPosition;
        this.paintPiece();
      }
      this.MIPTimeoutId = setTimeout(() => {
        this.MIP = false;
        this.MIPTimeoutId = null;
      }, 100);
    }
  }

  detectBoardCollision (position, pieceMatrix) {
    let collision = false;

    for (let i of pieceMatrix.keys()) {
      for (let j of pieceMatrix[i].keys()) {
       collision = (this.boardMatrix[position[0] + i] === undefined || this.boardMatrix[position[0] + i][position[1] + j] === undefined) 
        || (pieceMatrix[i][j] === 1 && (this.boardMatrix[position[0] + i] && typeof this.boardMatrix[position[0] + i][position[1] + j] === 'string'));
       if (collision) {
         return collision;
       }
      }
    }

    return collision;
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

  togglePause() {
    if (!this.gameOverFlag) {
      if (this.stop) {
        this.resume();
      } else {
        this.stopGame();
      }
    }
  }

  stopGame() {
    this.stop = true;
    this.resume = function() {
      setTimeout(this.tick.bind(this), this.tickerInterval);
      this.stop = false;
    }

  }

  gameOver() {
    this.stop = true;
    this.nextPiece = null;
    this.gameOverFlag = true;
  }

  // Styles calculators

  getBoardStyles(){
    return {'width': (719.45 * this.boardProportion) + 'px'}
  }

  // dev-tests ==========================================================================

  regenPiece() {
    this.initBoardMatrix();
    this.fallingPiecePosition = this.entryPoint;
    this.fallingPiece = new Piece(INITIAL_PIECE_SIZE, COLORS[Math.floor(Math.random() * (COLORS.length))]);
    this.paintPiece();
  }

  recalcBoardMatrix(input) {
    for (let i of this.fallingPiece.pieceMatrix.keys()) {
      for (let j of this.fallingPiece.pieceMatrix[i].keys()) {
        if( typeof this.boardMatrix[this.fallingPiecePosition[0] + i][this.fallingPiecePosition[1] + j] !== 'string')
          this.boardMatrix[this.fallingPiecePosition[0] + i][this.fallingPiecePosition[1] + j] += this.fallingPiece.pieceMatrix[i][j] == 1 ? input : 0; 
      }
    }
  }
  //

}
