define(['jquery', 'forceView'], function($, forceView) {
  return function(e, callback) {
    Appbase.credentials("sample_app_with_d3");
    Appbase.authPopup('facebook', function(error, authObj, requestObj) {
      if(error) {
        console.log('Error occured:', error);
      } else {
        console.log('Logged in as:', authObj.uid);
        $(".row.login").hide();
        $('.row.force-view').removeClass('hidden');
        forceView.init(authObj.name);
        require(['observeNS'], function(Observe) {
          Observe.init(authObj);
        });
      }
      callback && callback(error, authObj, requestObj);
    });
  };
});
