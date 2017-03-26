//initial function

/***********
* variable *
***********/
var activity_input = [];

//inputs from kokokon
var links =
[
  {
    source: 0, target: 1, interaction:
    [
      { name: 'a=b', give: 'money', source_affect: 5, receive: 'ticket', target_affect: -1 },
      { name: 'a=b2', give: 'gname', source_affect: -2, receive: 'credit', target_affect: 2 }
    ]
  },
  {
    source: 1, target: 2, interaction:
    [
      { name: 'b=c', give: 'ttt', source_affect: -2, receive: 'rrr', target_affect: 3 }
    ]
  }
];

// var $TABLE=$("#table_v");
// var $TABLE_F=$("#table_f");
var big_data=[]; // for all of data inspired by kokokon

var all_data_cal=[];  // all of data including variability and flow table
var init_f_array=[];
var init_f2_array=[];
init_f_array.push(init_f2_array);
all_data_cal.push(init_f_array);
var all_data_amount=[];  // record each num_col's length

var num_col=-1; // for click .table-lookup

var sum_f=0; // 總 達程度 的總和
var sum_c=0; // 總 複雜度 的總和
//var total_cost=0 // 總 cost

var temp2=10; // calculate importance degree
var weight_1=1; // calculate importance degree

jQuery.fn.pop = [].pop; // for click #export-btn
jQuery.fn.shift = [].shift;

/***********
*  customize function *
***********/

function U(){
  $('#export').text(JSON.stringify(all_data_cal));
  /*
  [
    [
      {"0":1,"1":"validation","2":"50","3":"50"},{"0":1,"1":"anytime service","2":"50","3":"50"}
    ] ,
    [
      {"0":2,"1":"self service","2":"50","3":"50"}
    ]
  ]
  */
}
function cal_LFEL(){
  var sum_fulfill=0;
  var sum_complexity=0;
  var sum_individual_cost=0;
  var all_data_cal_length=0;
  var data_cal_length=0;
  for( i=0 ; i< all_data_cal.length; i++){
    all_data_cal_length++;
    for(j=0 ; j<all_data_cal[i].length;j++){
      data_cal_length++;
      sum_fulfill+=parseInt(all_data_cal[i][j][2]);
      sum_complexity+=parseInt(all_data_cal[i][j][3]);
      sum_individual_cost+=parseInt(all_data_cal[i][j][4]);
    }
  }
  var LFEL_score=(sum_fulfill-(sum_complexity/2)-(sum_individual_cost/2))/(data_cal_length);
  LFEL_score=Math.round((LFEL_score+100)/2); // 取整數
  $('#LFEL').text(LFEL_score);
}
// recommended_strategy
function recommend_strategy($B_DEGREE_OR_WEIGHT,a) {
  var msg_re_strategy;
  if (a>=25){
    msg_re_strategy=("LCA > CA > UR > CR");
  }
  else if (a>=12) {
    msg_re_strategy=("LCA > UR > CA > CR");
  }
  else{
    msg_re_strategy=("LCA > UR > CR");
  }
  $B_DEGREE_OR_WEIGHT.parents().children('td:eq(5)').text(msg_re_strategy);
}

/***********
*  events *
***********/

Template.flow.events({
  "click .table-add":function(){
    var i=$('#table_v tr').length-1;
    var $clone=$("#table_v").find('tr.hide').clone(true).removeClass('hide table-line').addClass('row_'+i);
    $("#table_v").find('table').append($clone);
  },
  //remove row
  "click .table-remove":function(event){
    $(event.target).parents('tr').detach();
  },

  //to lookup the flow elements
  "click .table-lookup":function(event){
    //num_col for #cal-btn for save to json
    num_col=$(event.target).parents('td').parents('tr').index();


    var cnt_l=$('#table_f tr').length;
    // 清空右邊flow table資料
    for(i=cnt_l; i>=2; i--){
      $("#table_f").find('tr').eq(i).detach();
    }

    //if there's data in json, add a row in flow table
    if(num_col<all_data_amount.length){
      for(i=0; i<all_data_amount[num_col] ;i++){
        var $clone=$("#table_f").find('tr.hide').clone(true).removeClass('hide table-line').addClass('row_'+i+1);
        $("#table_f").find('table').append($clone);


        // $(".f_element").val(JSON.parse([0][num_col]["1"]));
        // $(".f_degree").val(JSON.parse([0][num_col]["2"]));
        // $(".c_degree").val(JSON.parse([0][num_col]["3"]));
        // $(".individual_cost").val(JSON.parse([0][num_col]["4"]));
      }
    }
    else{

    //if there's no data in json, add a row in flow table
      var k=1;
      var $clone=$("#table_f").find('tr.hide').clone(true).removeClass('hide table-line').addClass('row_'+k);
      $("#table_f").find('table').append($clone);
    }
  },
  // save button for json
  "click #cal-btn":function(){
    // new version to json
    // for links, most outside
    for(i=0 ; i<links.length ; i++){
      for(j=0 ; j<links[i].interaction.length; j++){
        var activity_name=links[i].interaction[j].name;
        new_activity={ activity: activity_name, detail: []};
        big_data.push(new_activity);
      }
    }

    var table_v_rows = $("#table_v").find('tr:not(:hidden)').length-1;

    var _varibiity_Type, _condition, _b_Degree, _weight, _i_Degree,  _strategy ;


    for(i=0 ; i<big_data.length ; i++){
      for(j=0 ; j<table_v_rows ; j++){
        new_varibility={
          varibiity_Type:_varibiity_Type , condition:_condition , band_Degree: _b_Degree ,
          weight:_weight , i_degree:_i_Degree , strategy: _strategy , element:[]
        };
        big_data[i].detail.push(new_varibility);

      }

    }

    // old failed version////////////
    // var data_flow_table = []; //中間層
    // var headers_varibiity=[]; // varibiity table's headers
    // var $rows_varibility=$("#table_v").find('tr:not(:hidden)');
    // $($rows_varibility.shift()).find('th:not(:empty)').each(function () {
    //   headers_varibiity.push($(this).text());
    // });
    // $rows_varibility.each(function(){
    //   var $td_varibility=$(this).find('td');
    //   var h_v={};
    //   h_v[headers_varibiity[0]]=$td_varibility.find('.v_type').val();
    //   h_v[headers_varibiity[1]]=$td_varibility.find('.sub_service').val();
    //   h_v[headers_varibiity[2]]=$td_varibility.find('.b_degree').val()/2;
    //   h_v[headers_varibiity[3]]=$td_varibility.find('.weight').val();
    //   h_v[headers_varibiity[4]]=$td_varibility.text();
    //   h_v[headers_varibiity[5]]=$td_varibility.text();
    //   data_flow_table.push(h_v);
    // });
    //
    //
    //
    //
    // var headers_flow=[]; //flow table's headers
    // var $rows = $("#table_f").find('tr:not(:hidden)');
    // // $rows.shift();
    // headers_flow.push("index_v");
    // $($rows.shift(event)).find('th:not(:empty)').each(function () {
    //   headers_flow.push($(this).text());
    //   //headers.push($(this).text().toLowerCase());
    // });
    // var cnt=0;
    // $rows.each(function () {
    //   var $td = $(this).find('td');
    //   var h = {};
    //   h[headers_flow[0]]=num_col;
    //   h[headers_flow[1]]=$td.find('.f_element').val();
    //   h[headers_flow[2]]=$td.find('.f_degree').val();
    //   h[headers_flow[3]]=$td.find('.c_degree').val();
    //   h[headers_flow[4]]=$td.find('.individual_cost').val();
    //   data_flow_table.push(h);
    //   cnt++;
    // });
    // all_data_amount.splice(num_col,1,cnt);
    // all_data_cal.splice(num_col,1,data_flow_table);
    $('#export').text(JSON.stringify(big_data));
    cal_LFEL();
    // U();
  },
  // "change .cost_degree":function(){
  //   cal_LFEL();
  // },

  //****flow table opertion****//
  // add row
  "click .f_table-add":function(){
    var i=$('#table_f tr').length-1;
    var $clone=$("#table_f").find('tr.hide').clone(true).removeClass('hide table-line').addClass('row_'+i);
    $("#table_f").find('table').append($clone);
  },
  //remove row
  "click .f_table-remove":function(event){
    $(event.target).parents('tr').detach();
  },
  //calculate importance degree
  "change .b_degree":function(event){

    var b_degree_1=event.target.value; //.id   .className
    var i_degree_1=(b_degree_1)/2*weight_1;
    $(event.target).parents().children('td:eq(4)').text(i_degree_1);
    temp2=b_degree_1;
    var $B_DEGREE_CLASS=$(event.target);
    recommend_strategy($B_DEGREE_CLASS,i_degree_1);
  },
  "change .weight":function(event){
    weight_1=event.target.value;
    var im_degree=(temp2)/2*weight_1;
    var msg_re_strategy;
    var temp3=im_degree;
    var $WEIGHT_CLASS=$(event.target);
    recommend_strategy($WEIGHT_CLASS,temp3);
    $(event.target).parents().children('td:eq(4)').text(im_degree);
  },
  //// get the value
  "click #export-btn":function(event){
    var $rows = $("#table_v").find('tr:not(:hidden)');
    var data = [];
    var headers=[];
    // $rows.shift()
    $($rows.shift()).find('th:not(:empty)').each(function () {
      headers.push($(event.target).text());
      //headers.push($(this).text().toLowerCase());
    });
    $rows.each(function () {
      var $td = $(event.target).find('td');
      var h = {};
      //h=[0,1,1];

      h[headers[0]]=$td.find('.v_type').val();
      h[headers[1]]=$td.find('.sub_service').val();
      h[headers[2]]=($td.find('.b_degree').val())/2;
      h[headers[3]]=$td.find('.weight').val();
      h[headers[4]]=$td.eq(4).text();
      h[headers[5]]=$td.eq(5).text();
      data.push(h);
    });
    // $('#export').text(data);
    $('#export').text(JSON.stringify(data));
  }

});

/***********
*  helpers *
***********/
