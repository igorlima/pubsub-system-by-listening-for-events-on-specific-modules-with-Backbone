define(['forceView', 'jquery', 'colorpicker'], function(ForceView, $) {
  var nsref;

  $('#editNodeModal #textColorNode').colorpicker();
  $('button.add-node').on('click', function() {
    ForceView.channel.trigger( 'addedNode', {} );
  });
  $('button.remove-all-node').on('click', function() {
    nsref.on('vertex_added', function(err, vertexRef, obj) {
      if (!err) {
        vertexRef.destroy();
      }
      init();
    });
  });

  ForceView.channel.on( 'editedNode', function( node ) {
    $('#textColorNode').val(node.color);
    $('#textNode').val(node.label);
    $('#editNodeModal').modal('show');
    $('#editNodeModal button.btn.btn-primary')
      .off('click')
      .on('click', function(e) {
        nsref.v(node.id).setData({
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
    if (!namespace) {
      return;
    }

    nsref = namespace ? Appbase.ns( namespace.replace(/[ /~]/g, '') ) : nsref;
    nsref.off('vertex_added');
    nsref.off('vertex_removed');
    nsref.on('vertex_added', function(err, vertexRef, obj) {
      ForceView.channel.trigger( 'deleteNode', {});
      ForceView.channel.trigger( 'addNode', $.extend(obj.properties() || {}, {
        id: vertexRef.name()
      }));
      vertexRef.on('properties', function(error, ref, snapObj) {
        ForceView.channel.trigger('editNode', snapObj.properties());
      });
      vertexRef.on('edge_added', function(error, edgeRef, snapObj) {
        vertexRef.once('properties', function(error_source, ref_target, obj_target) {
          edgeRef && edgeRef.once('properties', function(error_target, ref_source, obj_source) {
            ForceView.channel.trigger('addLink', {
              source: obj_source.properties(),
              target: obj_target.properties(),
              id: edgeRef.name()
            });
          });
        });
      });
      vertexRef.on('edge_removed', function(error, edgeRef, snapObj) {
        ForceView.channel.trigger('deleteLink', {id: edgeRef.name()});
      });
    });
    nsref.on('vertex_removed', function(err, vertexRef, obj) {
      ForceView.channel.trigger('deleteNode', obj.properties());
    });
    console.log('appbaseSync loaded');
  }

  return {
    init: function (namespace) {
      ForceView.channel.trigger('clear', function() {
        init(namespace, "#chart");
      });
    }
  };
});
