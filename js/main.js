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

    forceView: 'force-view',
    loginModel: 'my-login-model',
    myView: 'my-view',
    nsModel: 'my-namespace-model',
    whoelseModel: 'my-whoelse-model',
    vertexModel: 'my-vertex-model'
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
    },
    d3: {
      exports: 'd3'
    },
    backbone: [ 'underscore' ],
    colorpicker: ['jquery'],
    typeahed: ['jquery']
  }
});

require(['jquery', 'bootstrap', 'myView'], function($, bootstrap, MyView) {
  new MyView();
});
