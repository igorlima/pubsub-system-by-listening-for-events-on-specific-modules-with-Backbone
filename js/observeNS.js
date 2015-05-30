define(['jquery', 'appbaseSync', 'typeahead'], function($, AppbaseSync) {
  var observeInput = '#observe-someone-else',
      substringMatcher = function(strs) {
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
      },
      namespaces = [],
      nsref = Appbase.ns('observe-what-someone-else-is-doing');

  $(observeInput).removeClass('hidden');
  $('#observe-someone-else').typeahead({ minLength: 1, highlight: true }, {
    name: 'namespaces',
    displayKey: 'value',
    source: substringMatcher(namespaces)
  });

  function init(authObj) {
    nsref.search({text:authObj.name, properties: ['name']}, function(err, array) {
      var path = (err || array.length === 0) ? Appbase.uuid() : array[0].rootPath.split('/')[1];
      nsref.v(path).setData({
        firstname: authObj.firstname,
        lastname: authObj.lastname,
        name: authObj.name,
        raw: authObj.raw
      });
    });
    nsref.on('vertex_added', function(err, vertexRef, obj) {
      var properties = obj && obj.properties && obj.properties();
      properties && properties.name && namespaces.push( properties.name );
    });
    $(observeInput).bind('typeahead:selected', function(event, obj, name) {
      AppbaseSync.init(obj.value);
    });
  };

  return {
    init: init
  }
  
});