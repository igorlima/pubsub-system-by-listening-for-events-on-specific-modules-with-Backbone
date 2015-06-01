/**
  NOTE: Remeber you are using my application sample_app_with_d3.
  Appbase is completely free up to 100 thousand API calls per month.
  Feel free to use it while you're learning.
  After that, create your own application's name,
  then new learners can use my API calls left. Thanks.
**/

define(['jquery', 'backbone', 'nsModel', 'whoelseModel', 'loginModel', 'typeahead'], function($, Backbone, NamespaceModel, WhoElseModel, LoginModel) {

  return Backbone.View.extend({
    el: 'body',
    events: {
      'click button.login': 'facebook',
      'click button.enter': 'getin',
      'click button.add-node': 'addNode',
      'click button.remove-all-node': 'removeAllNode',
      'click #editNodeModal button.btn.btn-primary': 'editNode'
    },

    initialize: function( options ) {
      this.whoelseModel = new WhoElseModel();
      this.loginModel = new LoginModel();
      this.$el.find('#observe-someone-else')
        .bind('typeahead:selected', function(event, obj, name) {
          console.warn(obj.value);
        });
      this.whoelseModel.on('change:namespaces', this.updateWhoElse, this);
      this.loginModel.on( 'change:authObj', this.sync, this );
      this.$el.find('.row.login').removeClass('hidden');
    },

    sync: function() {
      var authObj = this.loginModel.get( 'authObj' );
      this.$el.find(".row.login").hide();

      this.nsModel = new NamespaceModel( { name: authObj.name } );
      this.nsModel.on( 'change:vertexToEdit', this.openModelToEditVertex, this );
      this.whoelseModel.initSync( authObj );

      this.$el.find('.row.force-view').removeClass('hidden');
      this.$el.find('#observe-someone-else').removeClass('hidden');
    },

    facebook: function() {
      this.loginModel.set( 'type', 'facebook' );
    },

    getin: function() {
      this.loginModel.set( 'type', 'getin' );
    },

    updateWhoElse: function() {
      this.$el.find('#observe-someone-else')
        .typeahead('destroy');
      this.$el.find('#observe-someone-else')
        .typeahead({ minLength: 1, highlight: true }, {
          name: 'namespaces',
          displayKey: 'value',
          source: this.whoelseModel.substringMatcher()
        });
    },

    openModelToEditVertex: function() {
      var vertexToEdit = this.nsModel.get( 'vertexToEdit' );
      this.$el.find('#textColorNode').val( vertexToEdit.get('color') );
      this.$el.find('#textNode').val( vertexToEdit.get('label') );
      this.$el.find('#editNodeModal').modal('show');
    },

    editNode: function() {
      this.nsModel.get( 'vertexToEdit' ).set({
        color: this.$el.find('#textColorNode').val(),
        label: this.$el.find('#textNode').val()
      });
      this.$el.find('#editNodeModal').modal('hide');
    },

    addNode: function() {
      this.nsModel.addNode();
    },

    removeAllNode: function() {
      this.nsModel.removeAllNode();
    }

  });

});
