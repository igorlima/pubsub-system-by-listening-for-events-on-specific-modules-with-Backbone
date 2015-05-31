define(['backbone', 'forceView'], function(Backbone, ForceView) {

  return Backbone.Model.extend({

    initialize: function( options ) {
      this.vertexRef = Appbase.ns( this.get('namespace') ).v( this.get('id') );
      this.on('change:color change:label', this.change, this);
      this.sync();
      ForceView.channel.trigger( 'addNode', {
        id: options.id,
        color: options.color,
        label: options.label
      } );
    },

    sync: function() {
      var model = this;
      this.vertexRef.on('properties', function(error, ref, snapObj) {
        ForceView.channel.trigger('editNode', snapObj.properties());
      });
      this.vertexRef.on('edge_added', function(error, edgeRef, snapObj) {
        ForceView.channel.trigger('addLink', {
          source: {id: model.get('id')},
          target: {id: snapObj.properties().id},
          id: edgeRef.name()
        });
      });
      this.vertexRef.on('edge_removed', function(error, edgeRef, snapObj) {
        ForceView.channel.trigger('deleteLink', {id: edgeRef.name()} );
      });
    },

    change: function() {
      this.vertexRef.setData({
        color: this.get('color'),
        label: this.get('label')
      });
    }

  });

});
