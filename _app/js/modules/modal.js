module.exports = function () {

  var closeModal = function() {
    $('.modal-active').fadeOut();
    $('.modal-active').removeClass('modal-active');
    $('body').removeClass('modalActive')
  }

  $(document).ready( function ( ) {

    $('body').on('click', '.grid-item', function() {
      if ( $('body').hasClass('modalActive') ) {
        closeModal();
      } else {
        $modal = $(this).find('.modal');
        $modal.fadeIn();
        $modal.addClass('modal-active');
        $('body').addClass('modalActive');
      }
    });
  });
}
