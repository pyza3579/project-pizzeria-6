/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };
  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id; //wlasciwosc id dodana do stalej this = id? czy poprostu zapis stalej w pr.obiektowym?
      thisProduct.data = data;
      thisProduct.renderInMenu();//jak przeczytac te linie?
      thisProduct.initAccordion();// potrzebne tu jest do wywolania metofy thisProduct. Dlaczego?
      thisProduct.getElements();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
    }
    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);//dlaczego nie uzylismy jako argumentu fata?

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);//element DOM zapisujemy jakos wlasciwosc instancji? no niby gdzie?
      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* add element to menu */
      menuContainer.appendChild(thisProduct.element); //do elementu menuContainer dodaj element stalej this Product?
    }
    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }
    initAccordion(){
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableElement = thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      /* START: click event listener to trigger */
      clickableElement.addEventListener('click', function(){
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active'); //dlaczego z thisProduct.element ?
        /* find all active products */
        const activeProducts = document.querySelectorAll('article.active');
        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts){
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

    initOrderForm() { //odpowiedzialna za dodanie listenerów eventów do formularza, jego kontrolek, oraz guzika dodania do koszyka.
      const thisProduct = this;
      console.log('initOrderForm');
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }
    processOrder() {
      const thisProduct = this;
      console.log('processOrder');
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
    }

  }
  const app = {
    initMenu(){
      const thisApp = this;
      for(let productData in thisApp.data.products){ //co to za zabior elementow? this.App.data.ptroducts?
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource;
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();

}
