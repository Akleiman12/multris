

let COLORS = ['yellow','green','blue','red'];

export class Piece {

  pieceMatrix: number[][];
  matrixSize: number;
  color: string;

  constructor(mSize: number) {
    this.color = COLORS[Math.floor(Math.random() * (COLORS.length - 1))]
    this.matrixSize = mSize;
    this.initPiece();
    this.pieceMatrix = this.reduceMatrix(this.pieceMatrix);
  }

  /**
   * @description Returns correctly sized matrix filled with 0's
   */
  private initMatrix() {
    let emptyMatrix = [];
    for (let i = 0; i < this.matrixSize; i++) {
      emptyMatrix[i] = new Array(this.matrixSize);
      for (let j = 0; j < this.matrixSize; j++) {
        emptyMatrix[i][j] = 0;
      }
    }
    return emptyMatrix;
  }

  /**
   * @description Generate the piece shape
   */
  private initPiece() {
    this.pieceMatrix = this.initMatrix();
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

  /**
   * @description Reduces the matrix to fit the piece with no blank lines
   */
  private reduceMatrix(auxMatrix) {
    // columns and rows to erase
    const columns = [...auxMatrix[0].keys()];
    const rows = [];
    
    // Search Rows and Columns to erase
    for (let i = 0; i < auxMatrix.length; i++) {
      let flag = false;
      for (let j = 0; j < auxMatrix[i].length; j++) {
        if (auxMatrix[i][j]) {
          flag = true;

          columns.indexOf(j) != -1 ? columns.splice(columns.indexOf(j), 1) : null;
        }
      }
      if (!flag) {
        rows.push(i);
      }
    }
    // Erase Rows
    rows.reverse().forEach( (n) => {
      auxMatrix.splice(n, 1);
    })
    // Erase Columns
    columns.reverse().forEach( (n) => {
      for(let row = 0; row < auxMatrix.length; row++) {
        auxMatrix[row].splice(n, 1);
      }
    })
    return auxMatrix;
  }

  /**
   * @description Determine the rotation point of the newly created piece
   * @deprecated
   */
/*   private initRotationPoint() {
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
    this.rotationPoint = [];
    this.rotationPoint[0] = heightWeights.indexOf(Math.max(...heightWeights));
    this.rotationPoint[1] = widthWeights.indexOf(Math.max(...widthWeights));
  } */

  /**
   * @description Function to rotate piece, counter-clockwise
   */
  rotatePiece() {
    let n = this.pieceMatrix[0].length > this.pieceMatrix.length ? this.pieceMatrix[0].length -1 : this.pieceMatrix.length -1 ;
    let auxMatrix = this.initMatrix();
    for (let i = 0; i < this.pieceMatrix.length; i++) {
      for (let j = 0; j < this.pieceMatrix[i].length; j++) {
        auxMatrix[n-j][i] = this.pieceMatrix[i][j];
      }
    }
    auxMatrix = this.reduceMatrix(auxMatrix);
    this.pieceMatrix = auxMatrix;
  }

  genNum = (n?) => Math.floor(Math.random() * (n ? n : this.matrixSize));

}



