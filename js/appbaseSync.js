define(['pubsub', 'jquery', 'colorpicker'], function(PubSub, $) {
  var nsref;

  $('#editNodeModal #textColorNode').colorpicker();
  $('button.add-node').on('click', function() {
    PubSub.publish('forceView:addedNode', {});
  });
  $('button.remove-all-node').on('click', function() {
    nsref.on('vertex_added', function(err, vertexRef, obj) {
      if (!err) {
        vertexRef.destroy();
      }
      init();
    });
  });

  PubSub.subscribe('forceView:editedNode', function(msg, node) {
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
  });
  PubSub.subscribe('forceView:addedNode', function(msg, node) {
    var id = Appbase.uuid(), vref = nsref.v(id);
    node.id = id;
    vref.setData(node);
  });
  PubSub.subscribe('forceView:addedLink', function(msg, link) {
    var source = nsref.v(link.source.id),
        target = nsref.v(link.target.id),
        id = Appbase.uuid();
    source.setEdge( id, target, function(error) {
      if (!error) {
        link.id = id;
      }
    } );
  });
  PubSub.subscribe('forceView:deletedNode', function(msg, node) {
    if (node.id) {
      nsref.v(node.id).destroy();
    }
  });
  PubSub.subscribe('forceView:deletedLink', function(msg, link) {
    nsref.v( link.target.id ).removeEdge( [link.id] );
  });
 
  PubSub.publish('forceView:deleteNode', {});
 
  function init(namespace) {
    if (!namespace) {
      return;
    }

    nsref = namespace ? Appbase.ns( namespace.replace(/[ /~]/g, '') ) : nsref;
    nsref.off('vertex_added');
    nsref.off('vertex_removed');
    nsref.on('vertex_added', function(err, vertexRef, obj) {
      PubSub.publish('forceView:deleteNode', {});
      PubSub.publish('forceView:addNode', $.extend(obj.properties() || {}, {
        id: vertexRef.name()
      }));
      vertexRef.on('properties', function(error, ref, snapObj) {
        PubSub.publish('forceView:editNode', snapObj.properties());
      });
      vertexRef.on('edge_added', function(error, edgeRef, snapObj) {
        vertexRef.once('properties', function(error_source, ref_target, obj_target) {
          edgeRef && edgeRef.once('properties', function(error_target, ref_source, obj_source) {
            PubSub.publish('forceView:addLink', {
              source: obj_source.properties(),
              target: obj_target.properties(),
              id: edgeRef.name()
            });
          });
        });
      });
      vertexRef.on('edge_removed', function(error, edgeRef, snapObj) {
        PubSub.publish('forceView:deleteLink', {id: edgeRef.name()});
      });
    });
    nsref.on('vertex_removed', function(err, vertexRef, obj) {
      PubSub.publish('forceView:deleteNode', obj.properties());
    });
    console.log('appbaseSync loaded');
  }

  return {
    init: function (namespace) {
      PubSub.publish('forceView:clear', function() {
        init(namespace);
      });
    }
  };
});
