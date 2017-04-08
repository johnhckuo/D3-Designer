//#region variables
var width = 600;
var height = 500;
var radius = 60;
var colors = ['#7BA23F', '#046874', '#305A56', '#688D00', '#42602D', '#0D5661', '#646A58', '#58B2DC', '#0089A7', '#BC9F77', '#D19826', '#C18A26', '#C7802D'];
var svg_clicked = false;
var timer;
var draw_mode;
var clicked;
var clicked_node = null,
    start_node = null,
    end_node = null;
var clicked_link = null;
var on_node = false;
var bordercolor = '#404040';
var border = 1;
var consensus_level = 0,
    empowerment = 0,
    flow = 0;
var nodes = [], links = [], property = [], other_property = [];
var d3_variables = { consensus_level: consensus_level, empowerment_level: empowerment, flow_level: flow };
var svg_container, svg, borderPath, force, draw_line, activity, stakeholder;
//#endregion

Template.configuration.onRendered(function () {
    configuration_setting();
    do_changes();
    set_trend();

});

set_configuration_data = function (_nodes, _links, _property) {
    nodes = _nodes;
    links = _links;
    property = _property;
    force_activation();
    do_changes();
    svg.on('click', function () {
        //disable event
    });
    svg.selectAll('path').on('click', function () {
        //disable event
    });
    svg.selectAll('g').on('click', function () {
        //disable event
    });
}

interaction_style_setting = function (_source, _target, _weight) {
    svg.selectAll('path').style('stroke-width', '4px');
    for (i = 0; i < links.length; i++) {
        if ((_source == links[i].source.id) && (_target == links[i].target.id)) {
            svg.selectAll('path').filter(function (d, j) {
                if (j == i + 1)
                    d3.select(this).style('stroke-width', _weight + 'px');
            });
        }
    }
}

//countLink = function(){
//    if (linksCount.length != 0){
//        linksCount = [];
//    }
//    for (var i = 0 ; i < links.length ; i++){
//        var tempCounter = 0;
//        var flag = true;
//        for (var j = 0 ; j < links.length ; j++){
//            if (j < i && links[i].source == links[j].source && links[i].target == links[j].target){
//                flag = false;
//                break;
//            }else if(links[i].source == links[j].source && links[i].target == links[j].target){
//                tempCounter++;
//            }
//        }
//        if (flag){
//            linksCount.push({
//                "source": links[i].source,
//                "target": links[i].target,
//                "count": tempCounter
//            });
//        }
//    }
//}

configuration_setting = function () {
    //nodes = [        
    //    { id: 0, name: 'a', benefit: 3 },
    //    { id: 1, name: 'b', benefit: 4 },
    //    { id: 2, name: 'c', benefit: 3 }
    //];

    //linksCount = [];

    //links = [
    //    {
    //        source: 0, target: 1,
    //        interaction:
    //        [
    //            { name: 'a=b', give: -1, source_affect: 5, receive: 0, target_affect: -1 },
    //            { name: 'a=b2', give: -1, source_affect: -2, receive: 1, target_affect: 2 }
    //        ]
    //    },
    //    {
    //        source: 1, target: 2,
    //        interaction:
    //        [
    //            { name: 'b=c', give: 1, source_affect: -2, receive: 2, target_affect: 3 }
    //        ]
    //    }
    //];

    //property = [
    //    { id: 0, name: "ticket", rating: [], owner: 1, averageImportance: 0, used: 0 },
    //    { id: 1, name: "credit", rating: [], owner: 1, averageImportance: 0, used: 0 },
    //    { id: 2, name: "ccc", rating: [], owner: 2, averageImportance: 0, used: 0 }
    //];
countLink = function(){
    if (linksCount.length != 0){
        linksCount = [];
    }
    for (var i = 0 ; i < links.length ; i++){
        var tempCounter = 0;
        var flag = true;
        for (var j = 0 ; j < links.length ; j++){
            if (j < i && links[i].source == links[j].source && links[i].target == links[j].target){
                flag = false;
                break;
            }else if(links[i].source == links[j].source && links[i].target == links[j].target){
                tempCounter++;
            }
        }
        if (flag){
            linksCount.push({
                "source": links[i].source,
                "target": links[i].target,
                "count": tempCounter
            });
        }
    }
}

configuration_setting = function () {
    nodes = [
        { id: 0, name: 'a', benefit: 3 },
        { id: 1, name: 'b', benefit: 4 },
        { id: 2, name: 'c', benefit: 3 }
    ];

    linksCount = [];

    links = [
        {
            source: 0, target: 1, property_id: 0, weight:1, interaction:
            [
                { name: 'a=b', give: 'money', source_affect: 5, receive: 'ticket', target_affect: -1 },
                { name: 'a=b2', give: 'gname', source_affect: -2, receive: 'credit', target_affect: 2 }
            ]
        },
        {
            source: 1, target: 2, property_id: 1, weight:1, interaction:
            [
                { name: 'b=c', give: 'ttt', source_affect: -2, receive: 'rrr', target_affect: 3 }
            ]
        }
    ];


    property = [
        { id: 0, name: "aaa", rating: [], owner: 1, averageImportance: 0, used:1 },
        { id: 1, name: "bbb", rating: [], owner: 1, averageImportance: 0, used:1 },
        { id: 2, name: "ccc", rating: [], owner: 2, averageImportance: 0, used:1 },
        { id: 3, name: "ddd", rating: [], owner: 2, averageImportance: 0, used:0  },
        { id: 4, name: "eee", rating: [], owner: 2, averageImportance: 0, used:0  },
        { id: 5, name: "fff", rating: [], owner: 1, averageImportance: 0, used:0  }

    ];

    d3.select('body').style('background-color', '#E7E6E6');
    svg_container = d3.select('#full_container').append('div')
                                                .attr('id', 'svg_container')
                                                .style({
                                                    'width': width + 'px',
                                                    'height': height + 'px',
                                                    'position': 'absolute'
                                                });

    svg = d3.select('#svg_container').append('svg')
                                        .attr('width', width)
                                        .attr('height', height)
                                        .attr('id', 'svg');

    borderPath = svg.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", height)
                    .attr("width", width)
                    .style("stroke", bordercolor)
                    .style("fill", "none")
                    .style("stroke-width", border);
   // countLink();

    force_activation();

    draw_line = svg.append('svg:path')
                   .attr('class', 'link draw_line_hidden')
                   .attr('d', 'M0,0L0,0');

    activity = svg.append('svg:g').selectAll('path');
    stakeholder = svg.append('svg:g').selectAll('g');
}

force_activation = function () {
    force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .linkDistance(80)
        .charge(-500)
        .on('tick', tick);
}

tick = function () {
    //var temp = [];
    //for (var i = 0 ; i < linksCount.length; i++) {
    //    temp.push(linksCount[i].count);
    //}
    //var temp = linksCount.slice(0);

    activity.attr('d', function (d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dr,  //linknum awaits calculate
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = d.left ? 17 : 12,
            targetPadding = d.right ? 17 : 12,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);

        //for (var i = 0 ; i < linksCount.length; i++) {
        //    if (d.target.id == linksCount[i].target && d.source.id == linksCount[i].source) {
        //        dr = 60 / temp[i];
        //        temp[i]--;
        //        //console.log(dr + " , " + linksCount[i].target + " , " + linksCount[i].source);
        //    }
        //}
        dr = 60;
        return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
    });

    //countLink();

    stakeholder.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    });
}

do_changes = function() {
    //links
    if (links.length > 0) {
        activity = activity.data(links);

        activity.enter().append('svg:path')
                .attr('class', 'link')
                .on('mouseover', function (d) {
                    //d3.select(this).style('stroke-width', '6px');
                })
                .on('mouseout', function (d) {
                    //d3.select(this).style('stroke-width', '4px');
                })
                .on('click', function (d) {
                    if (clicked) {
                        //double_click();
                        clicked = false;
                        clicked_link = d;
                        cretae_interaction_container(d);
                        clearTimeout(timer);
                        d3.event.stopPropagation();
                    }
                    else {
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(function () {
                            //single_click();
                            clicked = false;
                        }, 200);
                        clicked = true;
                    }
                });
        activity.exit().remove();
    }
    //nodes
    if (nodes.length > 0) {
        stakeholder = stakeholder.data(nodes);

        var g = stakeholder.enter().append('svg:g').call(force.drag);

        g.append('svg:rect')
          .attr('class', 'node')
          .attr('width', 30)
          .attr('height', 30)
          .attr('x', -15)
          .attr('y', -15)
          .style('fill', function (d, i) {
              var color_index = i % colors.length;
              return colors[color_index];
          })
          .on('mouseover', function (d) {
              on_node = true;
              d3.select(this).attr('transform', 'scale(1.1)')
                             .style('stroke', function (d, i) { return d3.rgb(d3.select(this).style('fill')).darker(1); })
                             .style('stroke-width', '2px');
          })
          .on('mouseout', function (d) {
              on_node = false;
              d3.select(this).attr('transform', '')
                             .style('stroke-width', '0px');
          })
          .on('click', function (d) {
              // if (d3.event.defaultPrevented) return;
              if (clicked) {
                  //double_click();
                  clicked = false;
                  clicked_node = d;
                  add_stakeholder(d.id, d.x, d.y, 'edit');
                  clearTimeout(timer);
                  d3.event.stopPropagation();
              }
              else {
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(function () {
                      //single_click();
                      clicked = false;
                      //new line handle
                      clicked_node = d;
                      if (start_node == null) {
                          start_node = clicked_node;
                          //show draw line
                          draw_line.classed('draw_line_hidden', false)
                                   .attr('d', 'M' + start_node.x + ',' + start_node.y + 'L' + start_node.x + ',' + start_node.y);
                          draw_line.on('click', function () {
                              if (!on_node) {
                                  reset_node();
                              }
                          });
                          svg.on('mousemove', mousemove);
                      }
                      else if (start_node == clicked_node) {
                          reset_node();
                      }
                      else {
                          end_node = clicked_node;
                          var link = { source: start_node, target: end_node, interaction: [] };
                          links.push(link);
                          draw_line.classed('draw_line_hidden', true);
                          clicked_link = link;
                          cretae_interaction_container(link);
                          do_changes();
                      }
                  }, 200);
                  clicked = true;
              }
          });

        g.append('svg:text')
            .attr("id", function (d) { return "text_" + d.id; })
            .attr("x", ".2em")
            .attr("y", ".600em")
            .attr("text-anchor", "middle")
            .attr('class', 'id')
            .style('fill', '#404040')
            .text(function (d) { return d.name; })
            .call(wrap, 100);

        stakeholder.exit().remove();
    }
    //countLink();

    force.start();
}

reset_node= function () {
    start_node = null;
    clicked_node = null;
    end_node = null;
    clicked_link = null;
    draw_line.classed('draw_line_hidden', true);
    svg.on("mousemove", null);
}

mousemove = function () {
    draw_line.attr('d', 'M' + start_node.x + ',' + start_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
}

wrap = function(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text[0][0].textContent.split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = ".2em",
            y = ".8em",
            dy = 1,
            tspan = text.text(null)
                        .append("tspan")
                        .attr("dx", "-0.2em")
                        .attr("dy", "1.2em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

add_stakeholder = function (_index, _x, _y, edit_type) {
    var benefit_score = 0;
    var stakeholder_creater = d3.select('div.stakeholder_creater')
    stakeholder_creater.html('');
    stakeholder_creater.classed('container_hidden', false);
    var table = stakeholder_creater.append('table')
                                   .attr('class', 'container_table');

    var tr;
    tr = table.append('tr');
    tr.append('td').html('Name:')
                   .attr('class', 'configuration_font');

    var td = tr.append('td');
    td.append('input')
      .attr('type', 'text')
      .attr('class', 'line_input')
      .attr('id', 'stakeholder_name');

    if (edit_type != 'add') {
        nodes.filter(function (d, i) {
            if (d.id == _index) {
                $('#stakeholder_name').val(d.name);
                benefit_score = d.benefit;
            }
        });
        tr.append('td').append('input')
                       .attr('type', 'button')
                       .attr('value', 'DELETE')
                       .attr('class', 'red_btn')
                       .attr('onclick', 'stakeholder_delete("' + _index + '");');
    }

    tr = table.append('tr');
    property_table = tr.append('td').attr('colspan', 3)
                       .append('table').attr('class', 'property_container');
    var property_tr = property_table.append('tr');
    property_tr.append('td').html('PROPERTY:').attr('class', 'configuration_font').style('width', '10%');
    property_tr.append('td').style('width', '90%')
                            .append('input')
                            .attr('type', 'button')
                            .attr('value', 'ADD')
                            .attr('class', 'green_btn')
                            .attr('onclick', 'add_property("add");');

    if (edit_type != 'add') {
        load_property(_index);
    }

    tr = table.append('tr');
    if (edit_type != 'add') {
        tr.append('td').attr('colspan', 2).html('BENEFIT SCORE:' + benefit_score).attr('class', 'configuration_font').style('text-align', 'center');
        td = tr.append('td').style('text-align', 'left');
    }
    else {
        td = tr.append('td').style('text-align', 'right').attr('colspan', 3);
    }

    td.append('input')
      .attr('type', 'button')
      .attr('value', 'DONE')
      .attr('class', 'green_btn')
      .attr('onclick', 'stakeholder_save("' + _index + '",  ' + _x + ',' + _y + ' ,"' + edit_type + '");');

    td.append('input')
      .attr('type', 'button')
      .attr('value', 'CANCEL')
      .attr('class', 'red_btn')
      .attr('onclick', "d3.select('div.stakeholder_creater').classed('container_hidden', true);");

}

stakeholder_save = function (_index, _x, _y, edit_type) {
    var _id = parseInt(_index, 10);
    var _name = $('#stakeholder_name').val();
    //false = not be used
    var node_check = false;
    nodes.filter(function (d, i) {
        if ((d.name == _name) && (edit_type == 'add'))
            node_check = true;
    });
    if (node_check) {
        $('#stakeholder_name').focus();
        alert("This name" + _name + " has be used!");
    }
    else {
        if (_name != '') {
            if (edit_type == 'edit') {
                nodes.filter(function (d, i) {
                    if (d.id == _index) {
                        _id = d.id;
                        d.name = _name;
                        var t = d3.selectAll('text')
                        t.each(function () {
                            if (d3.select(this)[0][0].id == 'text_' + _index) {
                                d3.select(this)[0][0].textContent = _name;
                            }
                        });
                        wrap(t, 100);
                    }
                })
            }
            else {
                var node = { id: _id, name: _name, benefit: 0 };
                node.x = _x;
                node.y = _y;
                nodes.push(node);
            }
            save_property(_id);
            $('#stakeholder_name').val('');
            d3.select('div.stakeholder_creater').classed('container_hidden', true);
            do_changes();
        }
        else {
            $('#stackholder_name').focus();
            alert("Stakeholder's name cannot be empty!");
        }
    }
}

load_property = function (_owner) {
    $.each(property, function (i, p) {
        if (p.owner == _owner) {
            index = add_property('load');
            $('#property_name_' + index).val(p.name);
            $('#property_id_' + index).val(p.id);
        }
    })
}

add_property = function (_type) {
    property_table = d3.select('table.property_container');
    var input_index = property_table[0][0].childNodes.length;
    var property_tr = property_table.append('tr');
    property_tr.append('td');
    var property_td = property_tr.append('td').style('text-align', 'right');

    property_td.append('input')
               .attr('type', 'text')
               .attr('class', 'line_input')
               .attr('id', 'property_name_' + input_index);
    property_td.append('input')
           .attr('type', 'hidden')
           .attr('id', 'property_id_' + input_index)
           .attr('value', 'new');

    property_td.append('input')
               .attr('type', 'button')
               .attr('value', 'DELETE')
               .attr('class', 'red_btn')
               .attr('onclick', 'delete_property(' + input_index + ')');
    return (input_index);
}

delete_property = function (_index) {
    if ($('#property_id_' + _index).val() == 'new') {
        d3.select('table.property_container')[0][0].childNodes[_index].remove();
    }
    else {
        var toSplice = property.filter(function (l) {
            return (l.id == $('#property_id_' + _index).val());
        });
        toSplice.map(function (l) {
            property.splice(property.indexOf(l), 1);
        });
        d3.select('table.property_container')[0][0].childNodes[_index].remove();
    }
}

save_property = function (_owner) {
    property_count = d3.select('table.property_container')[0][0].childNodes.length;
    var max = 0;
    for (i = 0; i < property.length; i++) {
        if (property[i].id > max) {
            max = property[i].id;
        }
    }
    max++;
    for (i = 1; i < property_count; i++) {
        var _id, _name;
        _name = $('#property_name_' + i).val();
        if ($('#property_id_' + i).val() != 'new') {
            _id = $('#property_id_' + i).val();
            $.each(property, function (j, p) {
                if (p.id == _id) {
                    p.name = _name;
                }
            });
        }
        else {
            _id = max;
            var new_property = { id: _id, name: _name, rating: [], owner: _owner, averageImportance: 0 };
            property.push(new_property);
            max++;
        }
    }
}

cretae_interaction_container = function (link) {
    var container = d3.select('div.interaction_container');
    container.html('');
    container.classed('interaction_container_hidden', false);
    var t = link;
    var table = container.append('table')
                         .attr('id', 'interaction_table')
                         .attr('class', 'interaction_container');
    var thead = table.append('thead').append('tr');
    var controller = thead.append('td')
                          .attr('colspan', 5)
                          .text('INTERACTION ' + link.source.name + ' & ' + link.target.name)
                          .attr('class', 'configuration_font')
                          .style('font-size', '35px')
                          .style('text-align', 'left')
                          .style('width', '100%');

    thead = table.append('thead').append('tr');
    controller = thead.append('td')
                      .text('ACTIVITY')
                      .attr('class', 'configuration_font_white');

    controller.append('input')
                         .attr('type', 'button')
                         .attr('value', 'ADD')
                         .attr('class', 'green_btn')
                         .attr('onclick', 'add_interaction("' + link.source.id + '", "' + link.target.id + '");');

    thead.append('td').text(link.source.name + "'s PROPERTY").style('width', '25%').attr('class', 'configuration_font_white');
    thead.append('td').text(link.source.name + "'s AFFECT").style('width', '10%').attr('class', 'configuration_font_white');
    thead.append('td').text(link.target.name + "'s PROPERTY").style('width', '25%').attr('class', 'configuration_font_white');
    thead.append('td').text(link.target.name + "'s AFFECT").style('width', '10%').attr('class', 'configuration_font_white');

    var tbody = table.append('tbody').attr('id', 'item');

    for (i = 0; i < link.interaction.length; i++) {
        add_interaction(link.source.id, link.target.id);
        $('#interaction' + (i + 1)).val(link.interaction[i].name);
        $('#give' + (i + 1) + ' option[value=' + link.interaction[i].give + ']').attr('selected', 'selected');
        $('#source_affect' + (i + 1)).val(link.interaction[i].source_affect);
        $('#label_source_affect' + (i + 1)).text(link.interaction[i].source_affect);
        $('#interaction' + (i + 1)).val(link.interaction[i].name);
        $('#receive' + (i + 1) + ' option[value=' + link.interaction[i].receive + ']').attr('selected', 'selected');
        $('#target_affect' + (i + 1)).val(link.interaction[i].target_affect);
        $('#label_target_affect' + (i + 1)).text(link.interaction[i].target_affect);
    }
    interaction_control();
}

add_interaction = function (_source, _target) {
    var tbody = d3.select('div.interaction_container')
                  .select('#item');

    var i = tbody[0][0].childNodes.length;
    var tr = d3.select('div.interaction_container')
                  .select('tbody').insert('tr');
    tr.append('td').append('input')
          .attr('type', 'text')
          .attr('id', 'interaction' + (i + 1))
          .attr('class', 'line_input')
          .attr('value', '');
    tr.append('td').append('select')
                      .attr('id', 'give' + (i + 1));
    var give_select = $('#give' + (i + 1));
    give_select.append($('<option>', {
        value: "-1",
        text: ""
    }));

    for (property_count = 0; property_count < property.length; property_count++) {
        if (property[property_count].owner == _source) {
            give_select.append($('<option>', {
                value: property[property_count].id,
                text: property[property_count].name
            }));
        }
    }
    var td = tr.append('td').style('text-align', 'center');
    td.append('input')
        .attr('type', 'range')
        .attr('id', 'source_affect' + (i + 1))
        .attr('max', 10)
        .attr('min', -10)
        .attr('step', 1)
        .attr('value', 0)
        .on('change', function (d) {
            $('#label_source_affect' + (i + 1)).text($('#source_affect' + (i + 1)).val());
        });
    td.append('label')
        .attr('id', 'label_source_affect' + (i + 1))
        .text(0)
        .attr('class', 'configuration_font_white');

    tr.append('td').append('select')
                  .attr('id', 'receive' + (i + 1));
    var receive_select = $('#receive' + (i + 1));
    receive_select.append($('<option>', {
        value: "-1",
        text: ""
    }));
    for (property_count = 0; property_count < property.length; property_count++) {
        if (property[property_count].owner == _target) {
            receive_select.append($('<option>', {
                value: property[property_count].id,
                text: property[property_count].name
            }));
        }
    }
    var td = tr.append('td').style('text-align', 'center');
    td.append('input')
        .attr('type', 'range')
        .attr('id', 'target_affect' + (i + 1))
        .attr('max', 10)
        .attr('min', -10)
        .attr('step', 1)
        .attr('value', 0)
        .on('change', function (d) {
            $('#label_target_affect' + (i + 1)).text($('#target_affect' + (i + 1)).val());
        });
    td.append('label')
        .attr('id', 'label_target_affect' + (i + 1))
        .text(0)
        .attr('class', 'configuration_font_white');
}

interaction_control = function () {
    var tbody = d3.select('table.interaction_container').append('tbody').attr('id', 'control');

    var control_row = tbody.append('tr')
               .append('td')
               .attr('colspan', 6)
               .style('text-align', 'center');
    control_row.append('input')
               .attr('type', 'button')
               .attr('value', 'OK')
               .attr('alt', '')
               .attr('class', 'green_btn')
               .attr('onclick', 'save_interaction("save");');

    control_row.append('input')
               .attr('type', 'button')
               .attr('value', 'Cancel')
               .attr('alt', '')
               .attr('class', 'red_btn')
               .attr('onclick', 'save_interaction("no");');
}

save_interaction = function (order) {
    var container = d3.select('div.interaction_container');
    if (order == 'save') {
        var table = d3.select('div.interaction_container').select('#item');
        var new_link = [];
        for (i = 0; i < table[0][0].childNodes.length; i++) {
            var _name = $('#interaction' + (i + 1)).val();
            var _give = $('#give' + (i + 1)).val();
            var _receive = $('#receive' + (i + 1)).val();
            var _source_affect = $('#source_affect' + (i + 1)).val();
            var _target_affect = $('#target_affect' + (i + 1)).val();
            if ((_name != '') && (_give != '') && (_receive != '')) {
                var interact = { name: _name, give: _give, source_affect: _source_affect, receive: _receive, target_affect: _target_affect };
                new_link.push(interact);
            }
        }
        clicked_link.interaction = new_link;
        links.filter(function (d) {
            if (d.target == clicked_link.target && d.source == clicked_link.source) {
                d = clicked_link;
            }
        });
        benefit_update();
    }
    container.html('')
             .classed('interaction_container_hidden', true);

    reset_node();
}

benefit_update = function () {
    var t_benefit = 0;
    $.each(nodes, function (i, node) {
        var node_id = node.id;
        $.each(links, function (j, link) {
            if (link.source.id == node_id) {
                for (k = 0; k < link.interaction.length; k++) {
                    t_benefit = t_benefit + parseInt(link.interaction[k].source_affect, 10);
                }
            }
            else if (link.target.id == node_id) {
                for (k = 0; k < link.interaction.length; k++) {
                    t_benefit = t_benefit + parseInt(link.interaction[k].target_affect, 10);
                }
            }
        });
        node.benefit = t_benefit;
        t_benefit = 0;
    });
    run_consensus();
}


run_consensus = function () {
    var positive_counter = 0, negative_counter = 0;
    $.each(nodes, function (i, node) {
        if (node.benefit > 0)
            positive_counter++;
        else if (node.benefit < 0)
            negative_counter++;
    });
    consensus_level = parseFloat(positive_counter) / parseFloat(nodes.length);
    d3_variables.consensus_level = consensus_level.toFixed(2);
}

set_trend = function () {
    var trend = d3.select('#full_container').append('div')
                  .attr('id', 'trend_container')
                  .style('width', window.innerWidth - width - 50 + 'px')
                  .style('height', 600 + 'px')
                  .style('margin-top', 0 + 'px')
                  .style('margin-left', 720 + 'px');

    trend.append('input')
         .attr('type', 'text')
         .attr('id', 'keyword')
         .attr('size', 25);

    trend.append('input')
         .attr('type', 'button')
         .attr('value', 'SEARCH')
         .attr('class', 'trend_button green_btn')
         .style('margin-left', '5px')
         .attr('id', 'get_trend');

    trend.append('input')
         .attr('type', 'button')
         .attr('value', 'submit')
         .attr('id', 'submit');

    trend.append('table')
          .attr('id', 'trend_content')
          .attr('border', 1)
          .style('width', 600 + 'px')
          .style('display', 'none');
}

Template.configuration.events({
    'click #svg': function (event) {
        console.log(event)
        if (event.target.nodeName == 'svg') {
            if (svg_clicked) {
                //double_click();
                svg_clicked = false;
                var click_position_x = event.screenX;
                var click_position_y = event.screenY;
                add_stakeholder(nodes.length, click_position_x, click_position_y, 'add');
                clearTimeout(timer);
                //d3.event.stopPropagation();
            }
            else {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function () {
                    //single_click();
                    svg_clicked = false;
                    if (!draw_line.classed('draw_line_hidden') && !on_node) {
                        reset_node();
                    }
                }, 200);
                svg_clicked = true;
            }
        }
    },

    'click .trend_button ': function (e) {
        e.preventDefault();
        var _keyword;
        var source;
        var target_id = e.target.id;
        if (target_id == 'get_trend') {
            _keyword = $('#keyword').val();
            source = 'search_bar';
        }
        else {
            var json_index = target_id.substring(target_id.length - 1, target_id.length);
            _keyword = e.target.name;
            source = 'deeper';
        }
        Meteor.call('get_trend', { keyword: _keyword }, function (err, res) {
            if (err)
                alert(err);
            else {
                trend_data = jQuery.parseJSON(res).default.rankedList[0].rankedKeyword;
                var table = d3.select('#trend_content');
                table.style('display', 'block');
                table.html('');
                var thead = table.append('thead').append('tr');
                thead.append('th')
                     .text('Suggestion')
                     .style('width', '50%');
                thead.append('th')
                     .text('Search volume index')
                     .style('width', '50%');
                var tbody = table.append('tbody');
                for (i = 0; i < trend_data.length; i++) {
                    var tr = tbody.append('tr');
                    tr.append('td').text(trend_data[i].query);
                    tr.append('td').text(trend_data[i].value);
                    tr.append('td').append('input')
                                   .attr('id', 'btn_deeper_' + i)
                                   .attr('type', 'button')
                                   .attr('value', 'deeper')
                                   .attr('class', 'trend_button green_btn')
                                   .attr('name', trend_data[i].query);
                                   //.attr('onclick', 'search_trend("' + trend_data[i].query + '", "deeper");');
                }
                if (source == "deeper") {
                    $("#keyword").val(_keyword);
                }
            }

        });

    }


});
