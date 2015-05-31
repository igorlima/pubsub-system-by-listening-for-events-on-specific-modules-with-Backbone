define(['backbone', 'nsModel'], function(Backbone, NamespaceModel) {

  return Backbone.View.extend({
    el: 'body',
    events: {
      'click button.add-node': 'addNode',
      'click button.remove-all-node': 'removeAllNode',
      'click #editNodeModal button.btn.btn-primary': 'editNode'
    },

    initialize: function( options ) {
      var model, view;
      view = this;
      this.model = model = new NamespaceModel( { name: options.namespace } );
      this.model.on( 'change:vertexToEdit', this.openModelToEditVertex, this );
    },

    openModelToEditVertex: function() {
      var vertexToEdit = this.model.get( 'vertexToEdit' );
      this.$el.find('#textColorNode').val( vertexToEdit.get('color') );
      this.$el.find('#textNode').val( vertexToEdit.get('label') );
      this.$el.find('#editNodeModal').modal('show');
    },

    editNode: function() {
      this.model.get( 'vertexToEdit' ).set({
        color: this.$el.find('#textColorNode').val(),
        label: this.$el.find('#textNode').val()
      });
      this.$el.find('#editNodeModal').modal('hide');
    },

    addNode: function() {
      this.model.addNode();
    },

    removeAllNode: function() {
      this.model.removeAllNode();
    }

  });

});
