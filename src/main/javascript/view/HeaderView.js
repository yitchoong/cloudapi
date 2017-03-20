'use strict';
/*setup yaml files*/
var baseURL = window.location.protocol+ '//' + window.location.hostname+(window.location.port ? ':'+window.location.port: '') +'/';
//var baseURL = ‘http://localhost:8080/‘;
var urls = {
  index:      {yaml: baseURL + 'yaml/index.yaml', doc: '#', desc: 'Index'},
  products:   {yaml: baseURL + 'yaml/products.yaml', doc: baseURL + 'yaml/doc/products/', desc: 'Product Spec'},
  prospects:  {yaml: baseURL + 'yaml/prospects.yaml', doc: baseURL + 'yaml/doc/prospects/', desc: 'Prospect Spec'},
  quotations: {yaml: baseURL + 'yaml/quotations.yaml', doc: baseURL + 'yaml/doc/quotations/', desc: 'Quotation Spec'},
  proposals:  {yaml: baseURL + 'yaml/proposals.yaml', doc: baseURL + 'yaml/doc/proposals/', desc: 'Proposal Spec'}
};

SwaggerUi.Views.HeaderView = Backbone.View.extend({
  events: {
    'click #show-pet-store-icon'    : 'showPetStore',
    'click #explore'                : 'showCustom',
    'submit #api_selector'          : 'showCustom',
    'keyup #input_baseUrl'          : 'showCustomOnKeyup',
    'keyup #input_apiKey'           : 'showCustomOnKeyup',
    'change #input_baseUrl'         : 'showCustom'
  },

  docLink: '#doc_link',

  initialize: function(){},

  showPetStore: function(){
    this.trigger('update-swagger-ui', {
      url:'http://petstore.swagger.io/v2/swagger.json'
    });
  },

  showCustomOnKeyup: function(e){
    if (e.keyCode === 13) {
      this.showCustom();
    }
  },

  showCustom: function(e){
    if (e) {
      e.preventDefault();
    }

    this.trigger('update-swagger-ui', {
      url: urls[$('#input_baseUrl').val()].yaml
    });

    var doclink = urls[$('#input_baseUrl').val()].doc;
    $(this.docLink)[0].href = doclink;
    if (doclink == '#') {
      $(this.docLink)[0].target = '_self';
    }
    else {
      $(this.docLink)[0].target = '_blank';
    }
  },

  update: function(url, apiKey, trigger){
    if (trigger === undefined) {
      trigger = false;
    }

    //$('#input_baseUrl').val(url);

    if (trigger) {
      this.trigger('update-swagger-ui', {url:url});
    }
  }
});
