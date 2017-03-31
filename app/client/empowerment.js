var theta = 0, figureOffset, panelWidth = 210;
var empowerScore, panelCount;

empowerment_stakeholders = [];
empowerment_properties = [];
empowerment_links = [];


var lineWidthOffset = 200;

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

var dataReset = function(){
    for (var i = 0 ; i< empowerment_properties.length; i++){
        empowerment_properties[i].rating = [];
        empowerment_properties[i].averageImportance = 0;
    }
    visitedProperty = [];
    visitedCount = 0;
    actualVisitIndex = [];
}

var rangeElementBG = function(n, target){

    target.css({
      'background-image':'-webkit-linear-gradient(left ,#7D89DE 0%,#7D89DE '+n+'%,#444444 '+n+'%, #444444 100%)'
    });
}

// onNavButtonClick = function( increment ){
//     var carousel = $('#carousel');
//
//     theta += ( 360 / empowerment_stakeholders.length ) * increment * -1;
//     carousel.css('transform', 'rotateY(' + theta + 'deg)');
// };

var d3Testing = function(){

    var file = {};
    file.nodes = empowerment_stakeholders;
    file.links = empowerment_links;

    if (d3.select(".leftPanel svg").length >0){
        d3.select(".leftPanel svg").remove();
    }

    var width = 960,height = 500;

    var svg = d3.select(".leftPanel").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        .gravity(.05)
        .distance(100)
        .charge(-100)
        .size([width, height]);

    var render = function() {
      var json = file;
      force
          .nodes(json.nodes)
          .links(json.links)
          .start();

      var link = svg.selectAll(".link")
          .data(json.links)
        .enter().append("line")
          .attr("class", function(d){ return "link link"+d.source})
        .style("stroke-width", function(d) { return Math.sqrt(d.weight); });


      var node = svg.selectAll(".node")
          .data(json.nodes)
        .enter().append("g")
        .attr("class", function(d){ return "node node"+d.id})
        .call(force.drag);

      node.append("circle")
          .attr("r","5");

      node.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .text(function(d) { return d.name });

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      });
    };


    var nodes = $(".node");
    for (var i = 0 ; i < nodes.length ; i++){
        console.log(nodes.className);
    }






    render();
}



var updateLink = function(){
    var newLink = [];
    var visitedOwner = [];
    var visitedPropertyName = [];

    //get property owner and name
    for (var i = 0 ; i< visitedProperty.length ; i++){


        for (var j = 0 ; j < empowerment_properties.length; j++){
            if (visitedProperty[i].id == empowerment_properties[j].id){
                visitedPropertyName.push(empowerment_properties[j].name);
                visitedOwner.push(empowerment_properties[j].owner);
            }else{
                console.log("An error has occured in finding property owner & name");
            }
        }
    }

    console.log(visitedProperty);
    console.log(visitedPropertyName);
    console.log(visitedOwner);



    for (var i = 0 ; i < visitedProperty.length-1 ; i++){

        var interaction = [];

        interaction.push({
            'name': 'system matchmaking',
            'give': visitedPropertyName[i],
            'source_affect': 0,
            'receive': 'none',
            'target_affect': 0
        });

        newLink.push({
            'source': visitedOwner[i],
            'target': visitedOwner[i+1],
            'interaction': interaction
        });

    }



    for (var i = 0 ; i < newLink.length ; i++ ){
      for (var j = 0 ; j < empowerment_links.length ; j++ ){
          if (newLink[i].source == empowerment_links[j].source && newLink[i].target == empowerment_links[j].target){
              empowerment_links[j].weight += lineWidthOffset;
          }else{
              empowerment_links.push(newLink[i]);
              empowerment_links[empowerment_links.length-1].weight += lineWidthOffset;
          }
      }

    }

    //empowerment_links = newLink;
    console.log(newLink);
    //updateData(empowerment_stakeholders, empowerment_links, empowerment_properties);
    d3Testing();
    //benefit_update();
}


var importanceCalculator = function(){




}




/* ----- Matchmaking Functions ----- */

var updateAverageImportance = function(){
    for (var i = 0 ; i < empowerment_properties.length ; i++){
        var importance = 0;
        for (var j = 0 ; j < empowerment_properties[i].rating.length; j++){
            empowerment_properties[i].rating[j] = parseInt(empowerment_properties[i].rating[j]);
            if ( j == empowerment_properties[i].owner){
                continue;
            }
            importance += empowerment_properties[i].rating[j];
        }
        empowerment_properties[i].averageImportance = importance/(empowerment_stakeholders.length-1);
    }


}

var sort = function(list){
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

var findOrigin = function(){

    var priorityList = [];
    var visitList = [];
    var sortedList = [];

    for (var i = 0 ; i < empowerment_properties.length ; i++){
        var owner = parseInt(empowerment_properties[i].owner);
        var averageRating = empowerment_properties[i].averageImportance;
        var self_Importance = empowerment_properties[i].rating[owner];

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

    success = findVisitNode(origin);

    var score = 0 ;
    for (var i = 0 ; i<visitedProperty.length ; i++){
        //console.log(visitedProperty[i].priority)
        score += visitedProperty[i].priority;
    }

    empowerScore = score/(visitedProperty.length-1);
    alert("Empowerment Score :"+empowerScore);
}

var checkExist = function(elem, data){
    for (var i = 0 ; i < data.length; i++){
        if (elem == data[i].id && i != 0){
            return false;
        }
    }
    return true;
}

var findVisitNode = function(visitNode){

    var goThroughList = [];
    var diffList = [];
    //console.log(goThroughList);
    for (var i = 0 ; i < empowerment_properties.length ; i++){

        var newOwner = parseInt(empowerment_properties[i].owner);
        var currentOwner = parseInt(empowerment_properties[visitNode].owner);

        if (i == visitNode || (newOwner == currentOwner && i != origin)){
            continue;
        }

        var diff = returnPriority(visitNode, i);
        goThroughList.push({
          id:i,
          priority:diff
        });

    }
    console.log(goThroughList)
    goThroughList = sort(goThroughList);
    var flag = false;
    var visitIndex;

    for (var j = 0 ; j< empowerment_properties.length ; j++){
        flag = checkExist(goThroughList[j].id, visitedProperty);
        if (flag){
            visitIndex = j;
            break;
        }
        if (!flag && j == (empowerment_properties.length-1)){
            console.log("Fail");
            return;
        }
    }

    //test(goThroughList[visitIndex]);

    //
    visitedCount++;
    visitedProperty[visitedCount] = goThroughList[visitIndex];

    if (goThroughList[visitIndex].id == origin){
        console.log("Success");
        updateLink();
    }else{
        // return bytes32(visitNode);
        findVisitNode(goThroughList[visitIndex].id);
    }

}


var returnPriority = function(visitNode, i){

    //self diff
    var owner = parseInt(empowerment_properties[visitNode].owner);
    var self_Importance = empowerment_properties[visitNode].rating[owner];

    var currentRating = empowerment_properties[i].rating[owner];

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
  //     Init       //
  //                //
  ////////////////////

  Template.empowerment.onRendered(function () {
      if (empowerment_properties.length == 0 || empowerment_stakeholders.length == 0){
          alert("Data not Found");
          Router.go("/configuration");
      }
      d3Testing();

  });

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
        rangeElementBG(p, r);
      },
      'mouseenter .range, mousemove .range': function (e) {
        var r = $(e.target);
        var p = r.val();
        p = r.val();
        rangeElementBG(p, r);
      },
      "click #empowerTest": function(e){
          var values = [];
          $('.empowerContent .range').each(function(i, obj) {
              values.push($(this).val());
          });
          dataReset();
          for (var i = 0 ; i < empowerment_stakeholders.length ; i++){

            for (var j = 0 ; j < empowerment_properties.length; j++){
                empowerment_properties[j].rating.push(values[empowerment_properties.length*i+j]);
              }

          }
          //console.log(empowerment_properties)
          updateAverageImportance();
          findOrigin();
      },
      "click #removeProperty": function(e){
          var id = $(e.target).parent()[0].className;
          id = id.split("property")[1];

          var index;
          for (var i = 0 ; i < empowerment_properties.length; i++){
              if (empowerment_properties[i].id == id){
                  index = i;
              }
          }

          if (index > -1) {
            empowerment_properties.splice(index, 1);
          }
          Router.go("/empowerment");
          //Template.empowerment.__helpers.get('empowerment_properties')();
      },
      "click #newProperty": function(e){
          $(".hiddenDIV").toggleClass("displayNewProperty");
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
      //   var degree = 360/empowerment_stakeholders.length;
      //   var figureData = [];
      //   figureOffset = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / empowerment_stakeholders.length ) ) +350;
      //
      //   for (var i = 0 ; i < empowerment_stakeholders.length ; i++){
      //       var title = "<h2>" + empowerment_stakeholders[i] + "</h2>";
      //
      //       var content = "";
      //       for (var j = 0 ; j < empowerment_properties.length ; j ++){
      //           var propertyTitle = "<div><span>" + empowerment_properties[j].name + ": </span>";
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
          panelCount = empowerment_stakeholders.length;

          for (var i = 0 ; i < empowerment_stakeholders.length; i++){

              for (var j = 0 ; j < empowerment_properties.length; j++){
                detail.push({
                  "propertyClass" : "property"+empowerment_properties[j].id,
                  "name": empowerment_properties[j].name,
                  "value": empowerment_properties[j].rating[i],
                })
              }

              var panelClass = "empowerPanel";
              if (i == 0){
                panelClass += " empower_show";
              }

              data.push({
                "className": panelClass,
                "stakeholder": empowerment_stakeholders[i].name,
                "detail": detail
              });
              detail = [];
          }
          return data;
      },
      newProperties:function(){
          var data = [];

          for (var i = 0 ; i < empowerment_properties.length; i++){
              data.push({
                "name":empowerment_properties[i].name,
                "owner": empowerment_properties[i].owner

              })
          }
          return data;
      }
    });
}
