import Ember from 'ember';

const {
  set
} = Ember;

let matrix;
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
      if(!matrix){
        const dimensions = this.get('dimensions');
        const difficulty = this.get('difficulty');
        const mine = this.get('mine');
        const emptyCell = this.get('emptyCell');
        let mineCount = 0;
        matrix = [];
        for(let i=0;i<dimensions;i++){
          matrix[i] = new Array(dimensions);
          for(let j=0;j<dimensions;j++){
            const rand = parseInt(Math.random(10)*10);
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
          if(i!==(dimensions-1)){
            if(matrix[i+1][j].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(j!==(dimensions-1)){
            if(matrix[i][j+1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(i!==0){
            if(matrix[i-1][j].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(j!==0){
            if(matrix[i][j-1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(i!==(dimensions-1) && j!==0){
            if(matrix[i+1][j-1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(j!==(dimensions-1) && i!==0){
            if(matrix[i-1][j+1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(i!==(dimensions-1) && j!==(dimensions-1)){
            if(matrix[i+1][j+1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
          if(i!==0 && j!==0){
            if(matrix[i-1][j-1].value === mine){
              matrix[i][j].value = matrix[i][j].value+1;
            }
          }
        }
      }
    }
  },
  _cleanAround(x,y){
    const dimensions = this.get('dimensions');

    if(x!==(dimensions-1)){
      if(matrix[x+1][y].isVisibleCell === false){
        this._cellAnalyzer(x+1,y);
      }
    }
    if(y!==(dimensions-1)){
      if(matrix[x][y+1].isVisibleCell === false){
        this._cellAnalyzer(x,y+1);
      }
    }
    if(x!==0){
      if(matrix[x-1][y].isVisibleCell === false){
        this._cellAnalyzer(x-1,y);
      }
    }
    if(y!==0){
      if(matrix[x][y-1].isVisibleCell === false){
        this._cellAnalyzer(x,y-1);
      }
    }
    if(x!==(dimensions-1) && y!==0){
      if(matrix[x+1][y-1].isVisibleCell === false){
        this._cellAnalyzer(x+1,y-1);
      }
    }
    if(y!==(dimensions-1) && x!==0){
      if(matrix[x-1][y+1].isVisibleCell === false){
        this._cellAnalyzer(x-1,y+1);
      }
    }
    if(x!==(dimensions-1) && y!==(dimensions-1)){
      if(matrix[x+1][y+1].isVisibleCell === false){
        this._cellAnalyzer(x+1,y+1);
      }
    }
    if(x!==0 && y!==0){
      if(matrix[x-1][y-1].isVisibleCell === false){
        this._cellAnalyzer(x-1,y-1);
      }
    }
  },
  _cellAnalyzer(x,y){
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
      matrix = null;
      set(this,'mineCount',0);
      set(this,'emptyCell',0);
      set(this,'visibleCells',0);
      set(this,'result','');
    }
  }
});
