import {select, settings, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';
class Cart{
  constructor(element) { //konstruktor wykona funkcje na kazdym elemencie,tak?
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
    //console.log('new Cart', thisCart);
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {}; //wszystkie elem. DOM, wyszukane w komponencie koszyka
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    console.log('thisCart.dom.form', thisCart.dom.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);//dlaczego nie sa zapiane jak thisCart.renderTotalsKeys? Bo to input i nie ma wartosci podanej?


  }
  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function() {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function() {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function() {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: thisCart.dom.address.value,//tvalue, bo input?
      phone: thisCart.dom.phone.value,
      totalNumber: thisCart.totalNumber, //dlaczego one sa tylko tak zapisane? a nie z select.cart.totalNumber?
      subtotalPrice: thisCart.subtotalPrice, //czy to jest suma z metody update?
      deliveryFee: thisCart.deliveryFee,
      totalPrice: thisCart.totalPrice,
      products: [],
    };
    for (let oneProduct of thisCart.products) {
      oneProduct.getData();
      payload.products.push(oneProduct);
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
  add(menuProduct) {
    const thisCart = this;

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);//dobra, zrobilam to, ale nie wiem dlaczego tu ma byc menuProduct

    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }
  update() {
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for(let product of thisCart.products) {
      thisCart.subtotalPrice += product.price; //skad product.price? gdzie to jest wczesniej zdeklarowane?
      thisCart.totalNumber += product.amount; //tu tez, ktore amount to jest?
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log('thisCart.totalNumber', thisCart.totalNumber);
    console.log('thisCart.subtotalPrice', thisCart.subtotalPrice);
    console.log('thisCart.totalPrice', thisCart.totalPrice);
    for(let key of thisCart.renderTotalsKeys) {
      for(let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    console.log('index', index);
    console.log('value at index:', thisCart.products[index]);

    thisCart.products.splice(index, 1);

    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
}
export default Cart;
