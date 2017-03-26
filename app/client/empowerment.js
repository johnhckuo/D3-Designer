var theta = 0, figureOffset, panelWidth = 210;
var stakeholders = ["seller", "buyer"];
var properties = [
  {name : "ss",
   rating: [2,5],
   owner: 1,
   averageImportance: 0
  },
  {name : "aa",
   rating: [4,5],
   owner: 1,
   averageImportance: 0

  },
  {name : "dd",
   rating: [6,3],
   owner: 1,
   averageImportance: 0


  },
  {name : "cc",
   rating: [7,5],
   owner: 0,
   averageImportance: 0

  },
  {name : "bb",
   rating: [3,1],
   owner: 0,
   averageImportance: 0

  },
  {name : "ee",
   rating: [3,2],
   owner: 0,
   averageImportance: 0

  },
];

////////////////////
//                //
//     Helpers    //
//                //
////////////////////

window.onload = function(){


}


////////////////////
//                //
//     Utility    //
//     Function   //
//                //
////////////////////

var visitedProperty = [];
var visitedCount;  //in order to ignore the rest of the array elem
var actualVisitIndex = [];
var origin;

onNavButtonClick = function( increment ){
    var carousel = $('#carousel');

    theta += ( 360 / stakeholders.length ) * increment * -1;
    carousel.css('transform', 'rotateY(' + theta + 'deg)');
};

importanceCalculator = function(){




}

updateAverageImportance = function(){
    for (var i = 0 ; i < properties.length ; i++){
        var importance = 0;
        for (var j = 0 ; j < properties[i].rating.length; j++){
            if ( j == properties[i].owner){
                continue;
            }
            importance += properties[i].rating[j];
        }
        properties[i].averageImportance = importance/(stakeholders.length-1);
    }


}

function sort(list){
  //selection sort

    for (var i=0; i < list.length; i++)
    {

        var max_index = i;
        for (var j=i+1; j<list.length; j++){
            if (list[j].priority > list[max_index].priority){
                max_index = j;
            }
        }
        var temp = list[i];
        list[i] = list[max_index];
        list[max_index] = temp;

    }
    return list;
}

startMatching = function(){

    var priorityList = [];
    var visitList = [];
    var sortedList = [];

    for (var i = 0 ; i < properties.length ; i++){
        var owner = properties[i].owner;
        var averageRating = properties[i].averageImportance;
        var self_Importance = properties[i].rating[owner];

        var diff = averageRating - self_Importance;
        priorityList.push({
          id:i,
          priority:diff
        });
    }
    priorityList = sort(priorityList);

    origin = priorityList[0].id;

    visitedCount = 0;
    visitedProperty[visitedCount] = origin;
    success = tradingMatch(origin);
    console.log(visitedProperty);
}

checkExist = function(elem, data){
    for (var i = 0 ; i < data.length; i++){
        if (elem == data[i] && i != 0){
            return false;
        }
    }
    return true;
}

tradingMatch = function(visitNode){

    var goThroughList = [];
    var diffList = [];
    //console.log(goThroughList);
    for (var i = 0 ; i < properties.length ; i++){

        var newOwner = properties[i].owner;
        var currentOwner = properties[visitNode].owner;

        if (i == visitNode || (newOwner == currentOwner && i != origin)){
            continue;
        }

        var diff = matchingAlgo(visitNode, i);
        goThroughList.push({
          id:i,
          priority:diff
        });

    }

    goThroughList = sort(goThroughList);
    var flag = false;
    var visitIndex;

    for (var j = 0 ; j< properties.length ; j++){
        flag = checkExist(goThroughList[j].id, visitedProperty);
        if (flag){
            visitIndex = j;
            break;
        }
        if (!flag && j == (properties.length-1)){
            return "Fail";
        }
    }

    //test(goThroughList[visitIndex]);

    //
    visitedCount++;
    visitedProperty[visitedCount] = goThroughList[visitIndex].id;

    if (goThroughList[visitIndex].id == origin){
        return "Success";
    }else{
        // return bytes32(visitNode);
        tradingMatch(goThroughList[visitIndex].id);
    }

}


matchingAlgo = function(visitNode, i){

    //self diff
    var owner = properties[visitNode].owner;
    var self_Importance = properties[visitNode].rating[owner];

    var currentRating = properties[i].rating[owner];

    var diff = currentRating - self_Importance;

    //other diff
    //var (otherOwner, otherAverageRating) = property.getPartialProperty(i);
    //uint otherRating = property.getPropertyRating(visitNode, congress.stakeholderId(otherOwner));
    //uint other_Self_Importance = property.getPropertyRating(i, congress.stakeholderId(otherOwner));
    //int256 diff2 = int256(otherRating - other_Self_Importance);

    //int256 result = (diff + diff2)/2;
    return diff;
}


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
        var degree = 360/stakeholders.length;
        var figureData = [];
        figureOffset = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / stakeholders.length ) ) +350;

        for (var i = 0 ; i < stakeholders.length ; i++){
            var title = "<h2>" + stakeholders[i] + "</h2>";

            var content = "";
            for (var j = 0 ; j < properties.length ; j ++){
                var propertyTitle = "<div><span>" + properties[j].name + ": </span>";
                var inputField = "<input type='text' /></div>";

                content += propertyTitle+inputField;
            }
            var style = "transform: rotateY(" + degree*i + "deg) translateZ(" + figureOffset + "px) translate3d( 0, 0, 0)";
            figureData.push({
              "style":style,
              "value":content
            });
        }
        return figureData;
      },
    });
}
