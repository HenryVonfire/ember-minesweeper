import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['mine-cell'],
  classNameBindings: ['status'],
  symbol: Ember.computed(function(){
    const value = this.get('value');
    if(value === 0){
      return '';
    } else {
      return value;
    }
  }),
  status: Ember.computed('isVisibleCell', function(){
    const isVisibleCell = this.get('isVisibleCell');
    if(!isVisibleCell){
      return 'mine-grey';
    } else {
      return '';
    }
  }),
  click(){
    const x = this.get('x');
    const y = this.get('y');
    const value = this.get('value');
    this.sendAction('action',x,y,value);
  }
});
