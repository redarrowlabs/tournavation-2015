import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import Immutable from 'immutable';
//TODO: needed updated source
//import Carousel from 'nuka-carousel';
import Carousel from '../../../libs/nuka-carousel/carousel';

export default React.createClass({
  mixins: [Carousel.ControllerMixin],  
  displayName: 'AlertnessTracker',
  contextTypes: { flux: PropTypes.object.isRequired },
  behaviorKey: "alertness-level",

  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior(this.behaviorKey, this.state.selectedDate);
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: this.state.canSubmit});
  },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.healthBehaviorStateChanged);
    flux.getStore('date').listen(this.dateStateChanged);

    const currentHealthBehavior = this.state.currentHealthBehavior;
    const level = this.getData(currentHealthBehavior).get('level');
    this.refs.carousel.goToSlide((level - 1) || 0);
  },

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').unlisten(this.healthBehaviorStateChanged);
    flux.getStore('date').unlisten(this.dateStateChanged);
  },

  shouldComponentUpdate(nextProps, nextState) {
    const ret = !this._forceUpdateCarousel;
    this._forceUpdateCarousel = false;
    return ret;
  },

  // Update the selected item style
  // TODO WORKAROUND: force carousel to go to loaded slide (on date change)
  componentDidUpdate() {
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const selectedLevel = this.getData(currentHealthBehavior).get('level');
    this._forceUpdateCarousel = true;
    this.refs.carousel.goToSlide(selectedLevel - 1);
    this._resetSelectStyle(selectedLevel - 1);
  },

  healthBehaviorStateChanged(state) {
    this.setState(this.getStateFromStore());
  },

  dateStateChanged(state) {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior(this.behaviorKey, state.get('selectedDate'));
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  getStateFromStore() {
    const { flux } = this.context;
    const selectedDate = flux.getStore('date').getState().get('selectedDate');
    const currentHealthBehavior = flux.getStore('healthBehaviors').getState().get('currentHealthBehaviors').get(this.behaviorKey)
      || new Immutable.Map({
        _id: null,
        key: this.behaviorKey,
        filter: selectedDate,
        data: new Immutable.Map({
          level: null
        })
      });

    return {
      currentHealthBehavior: currentHealthBehavior,
      canSubmit: this._getCanSubmit(currentHealthBehavior.get('data')),
      selectedDate: selectedDate
    };
  },

  _getCanSubmit(data) {
    const selectedLevel = data.get('level');
    return selectedLevel !== null && selectedLevel !== undefined;
  },

  canSubmit() {
    return this.state.canSubmit;
  },

  doSubmit() {
    const { flux } = this.context;
    const currentHealthBehavior = this.state.currentHealthBehavior;
    
    if (currentHealthBehavior.get('_id')) {
      flux.getActions('healthBehaviors').updateHealthBehavior(currentHealthBehavior);
    } else {
      flux.getActions('healthBehaviors').submitHealthBehavior(currentHealthBehavior);
    }

    flux.getActions('submit').didSubmit({component: this.behaviorKey});
  },

  getData(healthBehavior) {
    return healthBehavior.get('data') ||
      Immutable.Map({
        start: null,
        end: null
      });
  },

  updateLevel(index) {
    //TODO FIX
    if (this._forceUpdateCarousel) {return;}
    
    const level = index + 1;
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const data = this.getData(currentHealthBehavior)
      .set('level', level);
    const canSubmit = this._getCanSubmit(data);

    this.setState({
      currentHealthBehavior: currentHealthBehavior.set('data', data),
      canSubmit: canSubmit
    });
    const { flux } = this.context;
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: canSubmit});
  },

  render() {
    this.levels = [];

    //TODO: FIX WORKAROUND
    //const currentHealthBehavior = this.state.currentHealthBehavior;
    //const selectedLevel = this.getData(currentHealthBehavior).get('level');
    /*initialSlideIndex={selectedLevel-1}*/

    return (
      <Carousel className="carousel"
        ref="carousel" 
        data={this.setCarouselData.bind(this, 'carousel')}
        decorators={this.Decorators}
        slidesToShow={3}
        slidesToScroll={1}
        cellAlign="center"
        dragging={true}
        easing="easeInOutElastic"
        edgeEasing="easeOutCirc"
        afterSlide={this.updateLevel}>
        <img src="images/level-1.png" onMouseDown={e => this._startClick(e)} onMouseUp={e => this._endClick(e, 0)} ref={ (ref) => {if (ref !== null ) this.levels.push(ref);} } />
        <img src="images/level-2.png" onMouseDown={e => this._startClick(e)} onMouseUp={e => this._endClick(e, 1)} ref={ (ref) => {if (ref !== null ) this.levels.push(ref);} } />
        <img src="images/level-3.png" onMouseDown={e => this._startClick(e)} onMouseUp={e => this._endClick(e, 2)} ref={ (ref) => {if (ref !== null ) this.levels.push(ref);} } />
        <img src="images/level-4.png" onMouseDown={e => this._startClick(e)} onMouseUp={e => this._endClick(e, 3)} ref={ (ref) => {if (ref !== null ) this.levels.push(ref);} } />
        <img src="images/level-5.png" onMouseDown={e => this._startClick(e)} onMouseUp={e => this._endClick(e, 4)} ref={ (ref) => {if (ref !== null ) this.levels.push(ref);} } />
      </Carousel>
    );
  },

  DRAG_THRESHOLD: 5,

  _startClick(e) {
    this._originX = e.pageX;
    this._originY = e.pageY;
  },

  _endClick(e, index) {
    let deltaX = e.pageX - this._originX;
    let deltaY = e.pageY - this._originY;
    let distance = Math.abs(deltaX) + Math.abs(deltaY);
    if (distance < this.DRAG_THRESHOLD) {
      this.refs.carousel.setState({dragging: false});
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopPropagation();
      this.refs.carousel.goToSlide(index);
    }
  },

  _resetSelectStyle(index) {
    for (let i = 0; i < this.levels.length; ++i) {
      if (i === index) {
        this.levels[i].classList.add('selectedLevel');
      } else {
        this.levels[i].classList.remove('selectedLevel');}
    }
  },

  Decorators: [
    {
      component: React.createClass({
        render() {
          return (
            <button
              style={this.getButtonStyles(this.props.currentSlide === 0)}
              onClick={this.props.previousSlide}><i className="fa fa-arrow-circle-left"></i></button>
          )
        },
        getButtonStyles(disabled) {
          return {
            border: 0,
            background: 'rgba(0,0,0,0.4)',
            color: 'white',
            padding: 10,
            outline: 0,
            opacity: disabled ? 0.3 : 1,
            cursor: 'pointer'
          }
        }
      }),
      position: 'CenterLeft'
    },
    {
      component: React.createClass({
        render() {
          return (
            <button
              style={this.getButtonStyles(this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount)}
              onClick={this.props.nextSlide}><i className="fa fa-arrow-circle-right"></i></button>
          )
        },
        getButtonStyles(disabled) {
          return {
            border: 0,
            background: 'rgba(0,0,0,0.4)',
            color: 'white',
            padding: 10,
            outline: 0,
            opacity: disabled ? 0.3 : 1,
            cursor: 'pointer'
          }
        }
      }),
      position: 'CenterRight'
    }
  ]
});