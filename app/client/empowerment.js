var theta = 0, stakeholderLength = 5, figureOffset, panelWidth = 210;

////////////////////
//                //
//     Utility    //
//     Function   //
//                //
////////////////////

onNavButtonClick = function( increment ){
  var carousel = $('#carousel');

  theta += ( 360 / stakeholderLength ) * increment * -1;
  carousel.css('transform', 'rotateY(' + theta + 'deg)');
};


if (Meteor.isClient) {

  ////////////////////
  //                //
  //     Event      //
  //                //
  ////////////////////

    Template.empowerment.events({
      'click #previous': function (e) {
        e.preventDefault();
        onNavButtonClick(-1);
      },
      'click #next': function (e) {
        e.preventDefault();
        onNavButtonClick(1);
      },
    });


    ////////////////////
    //                //
    //     Helpers    //
    //                //
    ////////////////////

    Template.empowerment.helpers({
      figures: function(){
        var degree = 360/stakeholderLength;
        var figureData = [];
        figureOffset = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / stakeholderLength ) ) +350;

        for (var i = 0 ; i < stakeholderLength ; i++){
            var figure = document.createElement("figure");
            var value = i;
            var style = "transform: rotateY(" + degree*i + "deg) translateZ(" + figureOffset + "px)";
            figureData.push({
              "style":style,
              "value":value
            });
        }
        return figureData;
      },
    });
}
