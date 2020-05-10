import BaseWidget from './BaseWidget.js'; 
import utils from '../utils.js';
import {select, settings} from '../settings.js';

class DatePicker extends BaseWidget {
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate,settings.datePicker.maxDaysInFuture);
    flatpickr(thisWidget.dom.input, {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        defaultDate: thisWidget.minDate,
        minDate: thisWidget.minDate,
        maxDate: thisWidget.maxDate,
        "disable": [
            function(date) {
                // return true to disable
                return (date.getDay() === 7 || date.getDay() === 1);
            }
        ],
        "locale": {
            "firstDayOfWeek": 1 // start week on Monday
        },
        onChange: function(dateStr) {
            thisWidget.value = dateStr;
        },
    });
  }

  parseValue(dateStr) {
    return (dateStr);

  }
  isValid() {
    return (true);
  }
  renderValue() {
    const thisWidget = this;
  }

}

export default DatePicker;