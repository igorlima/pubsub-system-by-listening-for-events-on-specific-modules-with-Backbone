define(['backbone'], function(Backbone) {

  return Backbone.Model.extend({

    initialize: function() {
      this.on('change:type', this.login, this);
    },

    login: function() {
      var type = this.get('type'), action = this[type];
      action && action.call(this);
    },

    facebook: function() {
      var model = this;
      Appbase.credentials("sample_app_with_d3");
      Appbase.authPopup('facebook', function(error, authObj, requestObj) {
        if(error) {
          console.log('Error occured:', error);
          model.set( 'error', error);
          return;
        }
        console.log('Logged in as:', authObj.uid);
        model.set( 'authObj', authObj );
      });
    },

    getin: function() {
      var view, authObj = {
        name: 'Igor Ribeiro Lima',
        firstname: 'Igor',
        lastname: 'Lima'
      };
      //Feel free to use it while you're learning.
      //After that, create your own application's name,
      //then new learners can use my API calls left. Thanks.
      Appbase.credentials("sample_app_with_d3", "3792bb2bddd86bf8f6a70522bae1f797");
      this.set( 'authObj', authObj );
    },

  });

});
