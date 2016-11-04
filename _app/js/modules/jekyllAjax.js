module.exports = function () {
jQuery(document).ready(function($) {

    var siteUrl = 'https://'+(document.location.hostname||document.location.host);

    $(document).delegate('a[href^="/"],a[href^="'+siteUrl+'"]', "click", function(e) {
        e.preventDefault();
        History.pushState({}, "", this.pathname);
    });

    History.Adapter.bind(window, 'statechange', function(){
        var State = History.getState();
        console.log(State);
        $.get(State.url, function(data){
          if (State.hash == '/') {
            $('.content').removeClass('content-active');
          } else {
            document.title = $(data).find("title").text();
            var d = $(data).filter('.container');
            $('.container').empty()
            $('.container').prepend(d);
            $('.content').addClass('content-active');
          }
            _gaq.push(['_trackPageview', State.url]);
        });
    });

    // $('body').on('click', '#back', function(e){
    //   // e.preventDefault();
    //   // History.back();
    //   $('.content').removeClass('content-active');
    // });

});
}
