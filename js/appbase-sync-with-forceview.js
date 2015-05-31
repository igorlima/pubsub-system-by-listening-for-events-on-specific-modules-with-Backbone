define(['forceView', 'backbone', 'jquery', 'mymodel', 'colorpicker'], function(ForceView, Backbone, $, MyModel) {
  var nsref, AppbaseEventChannel, appbase_namespace, d3_element_selector;

  AppbaseEventChannel = $.extend( {}, Backbone.Events );

  AppbaseEventChannel.on( 'setup', function( options ) {
    appbase_namespace = options.namespace;
    d3_element_selector = options.element_selector;
    nsref = appbase_namespace ? Appbase.ns( appbase_namespace.replace(/[ /~]/g, '') ) : nsref;
    options.callback && options.callback();
  } );

  AppbaseEventChannel.on( 'remove-all-node', function() {
    nsref.on('vertex_added', function(err, vertexRef, obj) {
      if (!err) {
        vertexRef.destroy();
      }
    });
  } );

  AppbaseEventChannel.on( 'watch:vertex:properties', function( vertexRef ) {
    vertexRef.on('properties', function(error, ref, snapObj) {
      ForceView.channel.trigger('editNode', snapObj.properties());
    });
  } );

  AppbaseEventChannel.on( 'watch:vertex:edge_removed', function( vertexRef ) {
    vertexRef.on('edge_removed', function(error, edgeRef, snapObj) {
      ForceView.channel.trigger('deleteLink', {id: edgeRef.name()} );
    });
  } );

  AppbaseEventChannel.on( 'watch:vertex:edge_added', function( vertexRef ) {
    vertexRef.on('edge_added', function(error, edgeRef, snapObj) {
      AppbaseEventChannel.trigger( 'addLink', {
        vertexRef: vertexRef,
        edgeRef: edgeRef
      } );
    });
  } );

  AppbaseEventChannel.on( 'addLink', function( options ) {
    var vertexRef = options.vertexRef, edgeRef = options.edgeRef;
    vertexRef.once('properties', function(error_source, ref_target, obj_target) {
      edgeRef && edgeRef.once('properties', function(error_target, ref_source, obj_source) {
        ForceView.channel.trigger('addLink', {
          source: obj_source.properties(),
          target: obj_target.properties(),
          id: edgeRef.name()
        });
      });
    });
  } );

  $('#editNodeModal #textColorNode').colorpicker();
  $('button.add-node').on('click', function() {
    ForceView.channel.trigger( 'addedNode', {} );
  });
  $('button.remove-all-node').on('click', function() {
    AppbaseEventChannel.trigger( 'remove-all-node' );
  });

  ForceView.channel.on( 'editedNode', function( node ) {
    var model = new MyModel(node);
    model.set( 'nsref', nsref);
    $('#textColorNode').val( model.get('color') );
    $('#textNode').val(node.get('label'));
    $('#editNodeModal').modal('show');
    $('#editNodeModal button.btn.btn-primary')
      .off('click')
      .on('click', function(e) {
        model.set({
          color: $('#textColorNode').val(),
          label: $('#textNode').val()
        });
        $('#editNodeModal').modal('hide');
      });
  } );

  ForceView.channel.on( 'addedNode', function( node ) {
    var id = Appbase.uuid(), vref = nsref.v(id);
    node.id = id;
    vref.setData(node);
  });
  ForceView.channel.on( 'addedLink', function( link ) {
    var source = nsref.v(link.source.id),
        target = nsref.v(link.target.id),
        id = Appbase.uuid();
    source.setEdge( id, target, function(error) {
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
  });

  ForceView.channel.trigger('deleteNode', {});

  function init(namespace) {
    if (!nsref || !namespace) {
      return;
    }
    nsref.off('vertex_added');
    nsref.off('vertex_removed');
    nsref.on('vertex_added', function(err, vertexRef, obj) {
      ForceView.channel.trigger( 'deleteNode', {});
      ForceView.channel.trigger( 'addNode', $.extend(obj.properties() || {}, {
        id: vertexRef.name()
      }));
      AppbaseEventChannel.trigger( 'watch:vertex:properties', vertexRef );
      AppbaseEventChannel.trigger( 'watch:vertex:edge_added', vertexRef );
      AppbaseEventChannel.trigger( 'watch:vertex:edge_removed', vertexRef );
    });
    nsref.on('vertex_removed', function(err, vertexRef, obj) {
      ForceView.channel.trigger('deleteNode', obj.properties());
    });
    console.log('appbaseSync loaded');
    console.log('namespace: ' + namespace);
  }

  return {
    init: function( namespace ) {
      AppbaseEventChannel.trigger( 'setup', {
        namespace: namespace,
        element_selector: "#chart",
        callback: function() {
          ForceView.channel.trigger( 'clear', function() {
            init(appbase_namespace, d3_element_selector);
          } );
        }
      } );
    }
  };
});
