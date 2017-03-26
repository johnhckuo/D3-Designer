var theta = 0, figureOffset, panelWidth = 210;
var empowerScore, panelCount;

stakeholders = [];
properties = [];


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

dataReset = function(){
    for (var i = 0 ; i< properties.length; i++){
        properties[i].rating = [];
        properties[i].averageImportance = 0;
    }
    visitedProperty = [];
    visitedCount = 0;
    actualVisitIndex = [];
}

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
            properties[i].rating[j] = parseInt(properties[i].rating[j]);
            if ( j == properties[i].owner){
                continue;
            }
            importance += properties[i].rating[j];
        }
        properties[i].averageImportance = importance/(stakeholders.length-1);
    }


}

sort = function(list){
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
    visitedProperty.push({id : origin, priority : 0})

    success = tradingMatch(origin);

    var score = 0 ;
    for (var i = 0 ; i<visitedProperty.length ; i++){
        //console.log(visitedProperty[i].priority)
        score += visitedProperty[i].priority;
    }

    empowerScore = score/(visitedProperty.length-1);
    alert(empowerScore);
}

checkExist = function(elem, data){
    for (var i = 0 ; i < data.length; i++){
        if (elem == data[i].id && i != 0){
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
    console.log(goThroughList)
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
            alert("Fail");
        }
    }

    //test(goThroughList[visitIndex]);

    //
    visitedCount++;
    visitedProperty[visitedCount] = goThroughList[visitIndex];

    if (goThroughList[visitIndex].id == origin){
        alert("Success");
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


function bg(n, target){
    target.css({
      'background-image':'-webkit-linear-gradient(left ,#7D89DE 0%,#7D89DE '+n+'%,#444444 '+n+'%, #444444 100%)'
    });
}

if (Meteor.isClient) {

  ////////////////////
  //                //
  //     Event      //
  //                //
  ////////////////////

  var panelCounter = 1;

    Template.empowerment.events({
      // 'click #previous': function (e) {
      //   e.preventDefault();
      //   onNavButtonClick(-1);
      // },
      // 'click #next': function (e) {
      //   e.preventDefault();
      //   onNavButtonClick(1);
      // },
      'click #next': function (e) {

          //$(".empower_show").toggleClass("empowerPanel");
          var temp = panelCounter;
          $(".empowerPanel:nth-child("+temp+")").css("z-index", -1);
          //$(".empowerPanel:nth-child("+temp+")").removeClass("empower_show");
          //$(".empowerPanel:nth-child("+temp+")").addClass("empower_transition");


          setTimeout(function(){
            $(".empowerPanel:nth-child("+temp+")").removeClass("empower_show");
          },1000);
          panelCounter = (panelCounter+1)%panelCount;
          if (panelCounter == 0){
              panelCounter = panelCount;
          }
          $(".empowerPanel:nth-child("+panelCounter+")").css("z-index", 1);
          $(".empowerPanel:nth-child("+panelCounter+")").addClass("empower_show");
        // $(".empowerPanel").toggleClass("empower_show");

      },
      'mouseenter .range, click .range': function (e) {
        var r = $(e.target);

        var p = r.val();
        p = r.val();
        bg(p, r);
      },
      'mouseenter .range, mousemove .range': function (e) {
        var r = $(e.target);
        var p = r.val();
        p = r.val();
        bg(p, r);
      },
      "click #empowerTest": function(e){
          var values = [];
          $('.empowerContent .range').each(function(i, obj) {
              values.push($(this).val());
          });
          console.log(values);
          dataReset();
          for (var i = 0 ; i < stakeholders.length ; i++){

            for (var j = 0 ; j < properties.length; j++){
                properties[j].rating.push(values[properties.length*i+j]);
              }

          }
          console.log(properties)
          updateAverageImportance();
          startMatching();
      },
      "click #removeProperty": function(e){
          var id = $(e.target).parent()[0].className;
          id = id.split("property")[1];

          var index;
          for (var i = 0 ; i < properties.length; i++){
              if (properties[i].id == id){
                  index = i;
              }
          }

          if (index > -1) {
            properties.splice(index, 1);
          }
          console.log(properties);
          Router.go("/empowerment");
          //Template.empowerment.__helpers.get('properties')();
      },
      "click #newProperty": function(e){
          $(".hiddenDIV").toggleClass("displayNewProperty");
          console.log("hh")
      },
      // "click #addProperty": function(e){
      //     $(".leftPanel").toggleClass("displayNewProperty");
      //
      // },

    });


    ////////////////////
    //                //
    //     Helpers    //
    //                //
    ////////////////////

    Template.empowerment.helpers({

      // figures: function(){
      //   var degree = 360/stakeholders.length;
      //   var figureData = [];
      //   figureOffset = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / stakeholders.length ) ) +350;
      //
      //   for (var i = 0 ; i < stakeholders.length ; i++){
      //       var title = "<h2>" + stakeholders[i] + "</h2>";
      //
      //       var content = "";
      //       for (var j = 0 ; j < properties.length ; j ++){
      //           var propertyTitle = "<div><span>" + properties[j].name + ": </span>";
      //           var inputField = "<input type='text' /></div>";
      //
      //           content += propertyTitle+inputField;
      //       }
      //       var style = "transform: rotateY(" + degree*i + "deg) translateZ(" + figureOffset + "px) translate3d( 0, 0, 0)";
      //       figureData.push({
      //         "style":style,
      //         "value":content
      //       });
      //   }
      //   return figureData;
      // },

      properties: function(){
          var data = [];
          var detail = [];
          panelCount = stakeholders.length;

          for (var i = 0 ; i < stakeholders.length; i++){

              for (var j = 0 ; j < properties.length; j++){
                detail.push({
                  "propertyClass" : "property"+properties[j].id,
                  "name": properties[j].name,
                  "value": properties[j].rating[i],
                })
              }

              var panelClass = "empowerPanel";
              if (i == 0){
                panelClass += " empower_show";
              }

              data.push({
                "className": panelClass,
                "stakeholder": stakeholders[i].name,
                "detail": detail
              });
              detail = [];
          }
          return data;
      },
      newProperties:function(){
          var data = [];

          for (var i = 0 ; i < properties.length; i++){
              data.push({
                "name":properties[i].name,
                "owner": properties[i].owner

              })
          }
          return data;
      }
    });
}
