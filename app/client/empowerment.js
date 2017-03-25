empowerInit = function() {
  var carousel = $('#carousel'),
      panelCount = carousel.children.length,
      theta = 0,
      radius = -288,
      onNavButtonClick = function( increment ){
        console.log(increment);
        theta += ( 360 / panelCount ) * increment * -1;
        carousel.css('transform', 'translateZ( '+ radius +'px ) rotateY(' + theta + 'deg)');
      };
      $("#previous").on("click", function(){
        console.log("init");

      });



};
