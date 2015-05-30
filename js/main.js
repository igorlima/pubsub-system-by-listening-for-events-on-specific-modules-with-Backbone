require.config({
  baseUrl: 'js',
  paths: {
    jquery: 'jquery.v1.11.2.min',
    forceView: 'force_view',
    bootstrap: 'bootstrap.min',
    d3: 'd3.v2.min',
    //appbase: 'appbase.v2.2.15.min',
    login: 'login',
    enter: 'enter',
    pubsub: 'PubSubJS',
    appbaseSync: 'appbaseSync',
    colorpicker: 'bootstrap-colorpicker.min',
    typeahead: 'typeahead.jquery',
    observeNS: 'observeNS'
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
    colorpicker: ['jquery'],
    typeahed: ['jquery']
  }
});

require(['jquery', 'bootstrap', 'login', 'enter', 'pubsub'], function($, bootstrap, login, enter, PubSub) {
  $('.row.login').removeClass('hidden');
  $('button.login').on('click', login);
  $('button.enter').on('click', enter);
});
