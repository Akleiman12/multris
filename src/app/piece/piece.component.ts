
export class Piece {

  boardPosition: number[];
  pieceMatrix: number[][];
  matrixSize: number;
  rotationPoint: number[];

  constructor(mSize: number) {
    this.matrixSize = mSize;
    this.initPiece();
    this.boardPosition = [0, 0];
    this.initRotationPoint();
    console.log();
  }

  /**
   * @description Initialize pieceMatrix and fill the matrix with 0
   */
  private initMatrix() {
    this.pieceMatrix = [];
    for (let i = 0; i < this.matrixSize; i++) {
      this.pieceMatrix[i] = new Array(this.matrixSize);
      for (let j = 0; j < this.matrixSize; j++) {
        this.pieceMatrix[i][j] = 0;
      }
    }
  }

  /**
   * @description Reduces the matrix to fit the piece with no blank lines
   */
  private reduceMatrix() {
    // columns and rows to erase
    const columns = [...this.pieceMatrix[0].keys()];
    const rows = [];
    for (let i = 0; i < this.pieceMatrix.length; i++) {
      let flag = false;
      for (let j = 0; j < this.pieceMatrix[i].length; j++) {
        if (this.pieceMatrix[i][j]) {
          flag = true;
          columns.splice(columns.indexOf(j), 1);
        }
      }
      if (flag) {
        rows.push(i);
      }
    }
    rows.forEach((rowIndex) => this.pieceMatrix[rowIndex]);
  }

  private initPiece() {
    this.initMatrix();
    const positions: number[][] = [[2, 2]];
    this.pieceMatrix[positions[0][0]][positions[0][1]] = 1;
    ForLoop: for (let i = 1; i < this.matrixSize; i++) {
      const selected = [...positions[Math.floor(Math.random() * positions.length)]];
      const growthDir = ['U', 'R', 'D', 'L'];
      do {
        const ele = growthDir.splice(Math.floor(Math.random() * growthDir.length), 1)[0];
        switch (ele) {
          case 'U':
            if (this.pieceMatrix[selected[0] - 1] && this.pieceMatrix[selected[0] - 1][selected[1]] === 0) {
              selected[0] = selected[0] - 1;
            }
            break;
          case 'R':
            if (this.pieceMatrix[selected[0]] && this.pieceMatrix[selected[0]][selected[1] + 1] === 0) {
              selected[1] = selected[1] + 1;
            }
            break;
          case 'D':
            if (this.pieceMatrix[selected[0] + 1] && this.pieceMatrix[selected[0] + 1][selected[1]] === 0) {
              selected[0] = selected[0] + 1;
            }
            break;
          case 'L':
            if (this.pieceMatrix[selected[0]] && this.pieceMatrix[selected[0]][selected[1] - 1] === 0) {
              selected[1] = selected[1] - 1;
            }
            break;
          default:
            continue ForLoop;
        }
      } while (this.pieceMatrix[selected[0]][selected[1]] !== 0);

      positions.push(selected);
      this.pieceMatrix[selected[0]][selected[1]] = 1;
    }



  }

  private initRotationPoint() {
    const heightWeights: number[] = [];
    const widthWeights: number[] = [];
    for (const [i, column] of this.pieceMatrix.entries()) {
      let count = 0;
      for (const [j, block] of column.entries()) {
        if (widthWeights[j] === undefined) {
          widthWeights[j] = 0;
        }
        widthWeights[j] += block;
        count += block;
      }
      heightWeights[i] = count;
    }


  }

  genNum = (n?) => Math.floor(Math.random() * (n ? n : this.matrixSize));

}



