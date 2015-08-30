import Ember from 'ember';

const {
  set
} = Ember;

export default Ember.Component.extend({
  dimensions: 10,
  difficulty: 'easy',
  mine:'☠',
  mineCount:0,
  visibleCells:0,
  emptyCell:0,
  totalCells: Ember.computed('dimensions',function(){
    const dimensions = this.get('dimensions');
    return dimensions * dimensions;
  }),
  matrix: Ember.computed('matrixShow.[]',{
    get(){
      const matrix = this.get('matrixShow');
      if(!matrix){
        console.log('new matrix');
        const dimensions = this.get('dimensions');
        const difficulty = this.get('difficulty');
        const mine = this.get('mine');
        const emptyCell = this.get('emptyCell');
        console.log(`${difficulty}`);
        let mineCount = 0;
        let matrix = [];
        for(let i=0;i<dimensions;i++){
          matrix[i] = new Array(dimensions);
          for(let j=0;j<dimensions;j++){
            const rand = Math.floor(Math.random()*10);
            let value = emptyCell;
            switch(difficulty){
              case 'hard':
              if(rand < 6){
                value = mine;
                mineCount = mineCount + 1;
              }
              break;
              case 'medium':
              if(rand < 3){
                value = mine;
                mineCount = mineCount + 1;
              }
              break;
              case 'easy':
              if(rand < 1){
                value = mine;
                mineCount = mineCount + 1;
              }
              break;
            }

            matrix[i][j] = {
              x:i,
              y:j,
              value:value,
              isVisibleCell:false
            };
          }
        }
        set(this,'mineCount',mineCount);
        this._adyacentMines(matrix,dimensions);
        set(this,'matrixShow',matrix);
      }

      return this.get('matrixShow');
    },
    set(key,value){
      console.log('set!!');
    }
  }),
  _adyacentMines:function(matrix,dimensions){
    const mine = this.get('mine');
    for(let i=0;i<dimensions;i++){
      for(let j=0;j<dimensions;j++){
        if(matrix[i][j].value !== mine){
          const big = dimensions-1;
          const iPlus1 = i+1;
          const iMinus1 = i-1;
          const jPlus1 = j+1;
          const jMinus1 = j-1;

          if(i!==big){
            if(matrix[iPlus1][j].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(j!==big){
            if(matrix[i][jPlus1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(i!==0){
            if(matrix[iMinus1][j].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(j!==0){
            if(matrix[i][jMinus1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(i!==big && j!==0){
            if(matrix[iPlus1][jMinus1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(j!==big && i!==0){
            if(matrix[iMinus1][jPlus1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(i!==big && j!==big){
            if(matrix[iPlus1][jPlus1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(i!==0 && j!==0){
            if(matrix[iMinus1][jMinus1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
        }
      }
    }
  },
  _cleanAround(x,y){
    const matrix = this.get('matrixShow');
    const dimensions = this.get('dimensions');
    const big = dimensions-1;
    const xPlus1 = x+1;
    const xMinus1 = x-1;
    const yPlus1 = y+1;
    const yMinus1 = y-1;

    if(x!==big){
      if(matrix[xPlus1][y].isVisibleCell === false){
        this._cellAnalyzer(xPlus1,y);
      }
    }
    if(y!==big){
      if(matrix[x][yPlus1].isVisibleCell === false){
        this._cellAnalyzer(x,yPlus1);
      }
    }
    if(x!==0){
      if(matrix[xMinus1][y].isVisibleCell === false){
        this._cellAnalyzer(xMinus1,y);
      }
    }
    if(y!==0){
      if(matrix[x][yMinus1].isVisibleCell === false){
        this._cellAnalyzer(x,yMinus1);
      }
    }
    if(x!==big && y!==0){
      if(matrix[xPlus1][yMinus1].isVisibleCell === false){
        this._cellAnalyzer(xPlus1,yMinus1);
      }
    }
    if(y!==big && x!==0){
      if(matrix[xMinus1][yPlus1].isVisibleCell === false){
        this._cellAnalyzer(xMinus1,yPlus1);
      }
    }
    if(x!==big && y!==big){
      if(matrix[xPlus1][yPlus1].isVisibleCell === false){
        this._cellAnalyzer(xPlus1,yPlus1);
      }
    }
    if(x!==0 && y!==0){
      if(matrix[xMinus1][yMinus1].isVisibleCell === false){
        this._cellAnalyzer(xMinus1,yMinus1);
      }
    }
  },
  _cellAnalyzer(x,y){
    const matrix = this.get('matrixShow');
    const value = matrix[x][y].value;
    const mine = this.get('mine');
    const emptyCell = this.get('emptyCell');
    switch(value){
      case mine:
      //do Nothing
      break;
      case emptyCell:
      set(matrix[x][y],'isVisibleCell',true);
      set(this,'visibleCells',this.get('visibleCells') + 1);
      this._cleanAround(x,y);
      break;
      default:
        set(matrix[x][y],'isVisibleCell',true);
        set(this,'visibleCells',this.get('visibleCells') + 1);
    }
  },
  actions:{
    cellClicked(x,y,value){
      const matrix = this.get('matrixShow');
      const mine = this.get('mine');
      if(value === mine){
        set(matrix[x][y],'isVisibleCell',true);
        set(this,'result','you loose');
        console.log('you loose');
      } else {
        this._cellAnalyzer(x,y);
        const mineCount = this.get('mineCount');
        const totalCells = this.get('totalCells');
        const visibleCells = this.get('visibleCells');
        if((totalCells - mineCount) === visibleCells){
          set(this,'result','you win');
          console.log('you win');
        }
        console.log(totalCells + ' - ' + mineCount + ' = ' + (totalCells - mineCount) + ' > ' + visibleCells);
      }
    },
    restart(){
      set(this,'matrixShow',null);
      //matrix = null;
      set(this,'mineCount',0);
      set(this,'emptyCell',0);
      set(this,'visibleCells',0);
      set(this,'result','');
    },
    cleanAll(){
      const matrix = this.get('matrixShow');
      const dimensions = this.get('dimensions');
      for(let i=0;i<dimensions;i++){
        for(let j=0;j<dimensions;j++){
          set(matrix[i][j],'isVisibleCell',true);
        }
      }
    }
  }
});
