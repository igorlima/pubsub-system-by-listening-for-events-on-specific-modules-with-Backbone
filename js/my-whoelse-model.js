define(['jquery', 'backbone'], function($, Backbone) {

  return Backbone.Model.extend({

    initialize: function() {
      this.nsref = Appbase.ns('observe-what-someone-else-is-doing');
      this.set( 'namespaces', [] );
    },

    initSync: function(authObj) {
      this.updateUserData( authObj );
      this.sync();
    },

    updateUserData: function( authObj ) {
      var nsref = this.nsref;
      nsref.search({text:authObj.name, properties: ['name']}, function(err, array) {
        var path = (err || array.length === 0) ? Appbase.uuid() : array[0].rootPath.split('/')[1];
        nsref.v(path).setData({
          firstname: authObj.firstname,
          lastname: authObj.lastname,
          name: authObj.name,
          raw: authObj.raw
        });
      });
    },

    sync: function() {
      var model = this;
      this.nsref.on('vertex_added', function(err, vertexRef, obj) {
        var properties, namespaces;
        namespaces = $.extend( [], model.get('namespaces') );
        properties = obj && obj.properties && obj.properties();
        properties && properties.name && namespaces.push( properties.name );
        model.set( 'namespaces', namespaces );
      });
    },

    substringMatcher: function() {
      var strs = this.get( 'namespaces' );
      return function findMatches(q, cb) {
        var matches, substringRegex;
        matches = []; // an array that will be populated with substring matches
        substrRegex = new RegExp(q, 'i'); // regex used to determine if a string contains the substring `q`

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            // the typeahead jQuery plugin expects suggestions to a
            // JavaScript object, refer to typeahead docs for more info
            matches.push({ value: str });
          }
        });

        cb(matches);
      };
    }

  });

});