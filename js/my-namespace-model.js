define(['backbone', 'jquery', 'forceView', 'vertexModel'], function(Backbone, $, ForceView, VertexModel) {

  return Backbone.Model.extend({

    initialize: function( options ) {
      this.startSync( options.name );
    },

    startSync: function( namespace ) {
      var nsref, nsModel = this;
      namespace = namespace.replace(/[ /~]/g, '');
      this.nsref = nsref = Appbase.ns( namespace );
      this.vertexs = {};
      nsref.off('vertex_added');
      nsref.off('vertex_removed');
      ForceView.channel.trigger( 'clear' );
      ForceView.init( "#chart" );
      this.sync();

      nsref.on('vertex_added', function(err, vertexRef, obj) {
        if (err) {
          return;
        }

        var vertexProperties = $.extend( obj.properties(), {
          namespace: namespace
        });
        nsModel.vertexs[ obj.properties().id ] = new VertexModel( vertexProperties );
      });
      nsref.on('vertex_removed', function(err, vertexRef, obj) {
        nsModel.vertexs[ obj.properties().id ] = undefined;
        ForceView.channel.trigger('deleteNode', obj.properties());
      });
      console.log('appbase namespace loaded: ' + name);
    },

    sync: function() {
      var nsModel = this, nsref = this.nsref;
      ForceView.channel.on( 'addedNode', function( node ) {
        nsModel.addNode( node );
      });
      ForceView.channel.on( 'addedLink', function( link ) {
        var source = nsref.v(link.source.id),
            target = nsref.v(link.target.id),
            id = Appbase.uuid();
        target.setEdge( id, source, function(error) {
          if (!error) {
            link.id = id;
          }
        } );
      });
      ForceView.channel.on('deletedNode', function( node ) {
        if (node.id) {
          nsref.v(node.id).destroy();
        }
      });
      ForceView.channel.on('deletedLink', function( link ) {
        nsref.v( link.target.id ).removeEdge( [link.id] );
        nsref.v( link.source.id ).removeEdge( [link.id] );
      });
      ForceView.channel.on( 'editedNode', function( node ) {
        nsModel.set( 'vertexToEdit', nsModel.vertexs[ node.id ] );
      } );
    },

    addNode: function( options ) {
      var id, node = options || {};
      id = Appbase.uuid();
      vref = this.nsref.v( id );
      node.id = id;
      vref.setData(node);
    },

    removeAllNode: function() {
      this.nsref.on('vertex_added', function(err, vertexRef, obj) {
        if (!err) vertexRef.destroy();
      });
    }

  });

});
