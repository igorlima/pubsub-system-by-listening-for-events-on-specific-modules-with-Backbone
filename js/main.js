require.config({
  baseUrl: 'js',
  paths: {
    backbone: 'backbone.v1.2.0.min',
    bootstrap: 'bootstrap.min',
    colorpicker: 'bootstrap-colorpicker.min',
    d3: 'd3.v2.min',
    jquery: 'jquery.v1.11.2.min',
    typeahead: 'typeahead.jquery.v0.10.5',
    underscore: 'underscore.v1.8.3.min',

    enter: 'enter',
    forceView: 'force-view',
    login: 'fb-login',
    myView: 'my-view',
    nsModel: 'my-namespace-model',
    vertexModel: 'my-vertex-model',
    nsObserver: 'appbase-namespace-observer'
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
    },
    login: {
      //deps: ['appbase']
    },
    d3: {
      exports: 'd3'
    },
    backbone: [ 'underscore' ],
    colorpicker: ['jquery'],
    typeahed: ['jquery']
  }
});

require(['jquery', 'bootstrap', 'login', 'enter'], function($, bootstrap, login, enter ) {
  $('.row.login').removeClass('hidden');
  $('button.login').on('click', login);
  $('button.enter').on('click', enter);
});
