import Ember from 'ember';

export default Ember.Controller.extend({
  isVisibleGame:true,
  dimensions:10,
  easy: 'selected',
  medium: '',
  hard: '',
  difficulty:Ember.computed('easy','medium','hard',function(){
    let selected = 'easy';
    if(this.get('medium')){
      selected = 'medium';
    }
    if(this.get('hard')){
      selected = 'hard';
    }
    return selected;
  })
});
