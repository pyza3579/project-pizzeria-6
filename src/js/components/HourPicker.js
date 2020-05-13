/* global rangeSlider */

import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';
import {select, settings} from '../settings.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) { //dlaczego tu jest wrapper?
    super(wrapper, settings.hours.open);
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value; //dlaczego tu jest value?
  } 
  initPlugin() {
    const thisWidget = this;
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });
  }
  parseValue(value) { //Metoda parseValue ma przekazywać otrzymaną wartość do funkcji utils.numberToHour i zwracać wartość otrzymaną z tej funkcji. 
    return utils.numberToHour(value);

  }
  isValid() {
    return (true);
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerHTML= thisWidget.value;
  }
}
export default HourPicker; 