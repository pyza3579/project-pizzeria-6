import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';

export class Booking {
  constructor() {
    const thisBooking = this;
    thisBooking.render(booking);
    thisBooking.initWidgets();
    
  }

  render(booking) {
    const thisBooking = this;

    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();
    /* generate empty object thisBoking.dom */
    thisBooking.dom = {};
    /* save to this object wrapper as argument*/
    thisBooking.dom.wrapper = booking;
    /* change wrapper into HTML from the template */
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    /* in property thisBooking.dom.peopleAmount save every singleelement find in wrapper passend to the selector select.booking.peopleAmount */
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    /* the same for hoursAmount */
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper); //wyszukane we wraperze, tak? czy document?
}

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }
}
export default Booking;