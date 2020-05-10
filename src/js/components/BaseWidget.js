class BaseWidget{
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;
    thisWidget.correctValue = initialValue;
  }

  get value(){
    const thisWidget = this;
    return thisWidget.correctValue;
  }
  set value(value) { //skad sie value tutaj bierze?
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value);

    /* TO DO: Add validation*/

    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }

  setValue(value) {
    const thisWidget = this;
    thisWidget.value = value;
  }
  parseValue(value) {
    return parseInt(value);

  }

  isValid(value) {
    return !isNaN(value)
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.wrapper.innerHTML = thisWidget.value; //skad innerHTML tutaj?

  }
  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });//nie rozumiem, co jest tutaj czym
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}
export default BaseWidget;