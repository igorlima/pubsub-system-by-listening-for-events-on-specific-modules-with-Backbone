/**
  NOTE: Remeber you are using my application sample_app_with_d3.
  Appbase is completely free up to 100 thousand API calls per month.
  Feel free to use it while you're learning.
  After that, create your own application's name,
  then new learners can use my API calls left. Thanks.
**/
define(['jquery', 'forceView'], function($, forceView) {
  return function(e, callback) {
    var authObj = {
      name: 'Igor Ribeiro Lima',
      firstname: 'Igor',
      lastname: 'Lima'
    };
    //Feel free to use it while you're learning.
    //After that, create your own application's name,
    //then new learners can use my API calls left. Thanks.
    Appbase.credentials("sample_app_with_d3", "3792bb2bddd86bf8f6a70522bae1f797");

    $(".row.login").hide();
    $('.row.force-view').removeClass('hidden');
    forceView.init(authObj.name);
    require(['observeNS'], function(Observe) {
      Observe.init(authObj);
    });

    callback && callback(authObj);
  };
});
