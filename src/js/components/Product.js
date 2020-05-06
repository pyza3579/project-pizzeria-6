import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Product{
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.initAccordion();
    thisProduct.getElements();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();


    //console.log('new Product:', thisProduct);
  }
  renderInMenu() {
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* add element to menu */
    menuContainer.appendChild(thisProduct.element); //do elementu menuContainer dodaj element stalej this Product?
  }
  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion() {
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    const clickableElement = thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    /* START: click event listener to trigger */
    clickableElement.addEventListener('click', function() {
      /* prevent default action for event */
      event.preventDefault();
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');
      /* find all active products */
      const activeProducts = document.querySelectorAll('article.active');
      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {
        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct != thisProduct.element) {
        /* remove class active for the active product */
          activeProduct.classList.remove('active');
        /* END: if the active product isn't the element of thisProduct */
        }
      /* END LOOP: for each active product */
      }
    /* END: click event listener to trigger */
    });
  }

  initOrderForm() {
    const thisProduct = this;
    //console.log('initOrderForm');
    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs) {
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder() {
    const thisProduct = this;
    //console.log('processOrder');
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData', formData);
    thisProduct.params = {};
    let price = thisProduct.data.price;
    //console.log('price', price);

    /* START LOOP: For each paramId in thisProduct.data.params */
    for(let paramId in thisProduct.data.params) {
      /* Save the element in thisProduct.data.params with key paramId as const param*/
      const param = thisProduct.data.params[paramId]; //dlczego [paramId?] i dlaczego zapisujemy to tutaj
      /* START LOOP: for each optionId in param.options*/
      for(let optionId in param.options) {
        /* save the element in param.options with key optionId as const option*/
        const option = param.options[optionId]; //
        /*Start if: if option is selected and option is not default*/
        /*add price of option to variable price*/
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        if (optionSelected && !option.default) {
          price = price + option.price;
          /*End if option is selected and option is not default*/
        }
        /*start else if option is not selected and option is default*/
        /*deduct price of option from price*/
        else if (!optionSelected && option.default) {
          price = price - option.price;
          /*End else if*/
        }
        /*IF option is selected add class classNames.menuProduct.imageVisible*/
        const images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
        /*  if else checking if the option is been selcted */
        if (optionSelected) {
          if(!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          for(let image of images) {
            image.classList.add(classNames.menuProduct.imageVisible);
          }
        }
        else {
          for(let image of images) {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
        /*ELSE option isn't selected remove class classNames.menuProduct.imageVisible*/
      /*END LOOP for optionId*/
      }
    /*END LOOP for paramId*/
    }
    /*multiply price by amount*/
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /*set the contents of thisProduct.price Elem to be value of variable price*/
    thisProduct.priceElem.innerHTML = thisProduct.price; //jak na to wpasc?
    //console.log('thisProduct.params', thisProduct.params);
  }

  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem); //co tu sie dzeiej//
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
      //console.log('thisProduct.processOrder',thisProduct.processOrder);
    });
  }
  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct); //nie rozumiem tego, skad sie wzielo app.cart? do metody app.cart z funkcji   initCart: function() wrzucam .add(menuProduct)??, ktore jest wykonywane na thisProduct i produkt laduje w koszyku? No spoko, a jak man  to zdrowy czlowiek wpasc?
    //Wyslanie produktu do koszyka musimy przerobic od samego poczatku
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      }
    });

    thisProduct.element.dispatchEvent(event);
  }

}

export default Product;
