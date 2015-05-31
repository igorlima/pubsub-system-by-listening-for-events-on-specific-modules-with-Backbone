require.config({
  baseUrl: 'js',
  paths: {
    jquery: 'jquery.v1.11.2.min',
    forceView: 'force-view',
    bootstrap: 'bootstrap.min',
    d3: 'd3.v2.min',
    //appbase: 'appbase.v2.2.15.min',
    login: 'fb-login',
    enter: 'enter',
    backbone: 'backbone.v1.2.0.min',
    vertexModel: 'my-vertex-model',
    nsModel: 'my-namespace-model',
    myView: 'my-view',
    underscore: 'underscore.v1.8.3.min',
    appbaseSync: 'appbase-sync-with-forceview',
    colorpicker: 'bootstrap-colorpicker.min',
    typeahead: 'typeahead.jquery.v0.10.5',
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
