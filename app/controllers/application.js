import Ember from 'ember';

export default Ember.Controller.extend({
  isVisibleGame:true,
  dimensions:10,
  difficulty:'easy',
  restartGame: false,
  actions:{
    restart(){
      this.toggleProperty('restartGame');
      this.toggleProperty('isVisibleGame');
    }
  }
});
