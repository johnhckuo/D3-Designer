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

var selected_activity;

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
// recommended_strategy -> cancel ->use dropdown list
function recommend_strategy($B_DEGREE_OR_WEIGHT,idegree) {
  var msg_re_strategy;
  if (idegree>=25){
    msg_re_strategy=("LCA > CA > UR > CR");
  }
  else if (idegree>=12) {
    msg_re_strategy=("LCA > UR > CA > CR");
  }
  else{
    msg_re_strategy=("LCA > UR > CR");
  }
  $B_DEGREE_OR_WEIGHT.parents().children('td:eq(5)').find('p').text(msg_re_strategy);
  $B_DEGREE_OR_WEIGHT.parents().children('td:eq(5)').find('input hidden').val(msg_re_strategy);
}
function add_element_row(i,get_data){
  if(get_data==0){  // get_data=0  means only add a row no get data
    var $clone=$("#table_f").find('tr.hide').clone(true).removeClass('hide table-line').addClass('row_'+1);
    $("#table_f").find('table').append($clone);
  }else{
    // add data for json
    for(j=0; j<i ;j++){
      var $clone=$("#table_f").find('tr.hide').clone(true).removeClass('hide table-line').addClass('row_'+j);

      $clone.find(".f_element").val(big_data[selected_activity].detail[num_col].element[j].flow_Element);
      $clone.find(".f_degree").val(big_data[selected_activity].detail[num_col].element[j].fulfillment);
      $clone.find(".c_degree").val(big_data[selected_activity].detail[num_col].element[j].comlexity);
      $clone.find(".individual_cost").val(big_data[selected_activity].detail[num_col].element[j].cost);

      $("#table_f").find('table').append($clone);
    }
  }

}
function del_element_row(){
  var cnt_l=$('#table_f tr').length;
  for(i=cnt_l; i>=2; i--){
    $("#table_f").find('tr').eq(i).detach();
  }
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
    selected_activity=0;
    if(big_data.length==0){  //一開始都是空的
      add_element_row(1,0);
    }else{  // 不是空的
      if(big_data[selected_activity].detail.length==num_col){
        del_element_row();// 清空右邊flow table資料
        add_element_row(1,0);
      }else{
        // json 有data
        // 選定的detail row的 f_table row 數
        var element_len=big_data[selected_activity].detail[num_col].element.length;
        del_element_row();
        add_element_row(element_len,1);
      }
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
        // big_data.push(new_activity);
        big_data.splice(links.length,1, new_activity); // 怪怪的！
      }
    }


    // variability table
    var $table_v_rows = $("#table_v").find('tr:not(:hidden)');
    $table_v_rows.shift();
    var table_v_rows_length = $table_v_rows.length;
    // flow table
    var $table_f_rows = $("#table_f").find('tr:not(:hidden)');
    $table_f_rows.shift();
    var table_f_rows_length = $table_f_rows.length;

    // get value of variability table

      _varibiity_Type=$('.v_type');
      _condition=$('.sub_service');
      _b_Degree=$('.b_degree');//
      _weight=$('.weight');
      _i_Degree=$('.i_degree');  // problem
      _strategy=$('.strategy_option');

    // get value of flow table

      _flow_Element=$('.f_element');
      _fulfillment=$('.f_degree');
      _complexity=$('.c_degree');
      _cost=$('.individual_cost');


    for(i=0 ; i<big_data.length ; i++){
      if(( big_data[i].activity)==("a=b")){

        // num_col is which row you select
        for(j=0 ; j<=num_col ; j++){

          new_varibility={
            varibiity_Type:_varibiity_Type[j+1].value , condition:_condition[j+1].value , band_Degree: _b_Degree[j+1].value/2 ,
            weight:_weight[j+1].value , i_degree:_i_Degree[j+1].value , strategy: _strategy[j+1].value , element:[]
          };
          // big_data[i].detail.push(new_varibility);

          big_data[i].detail.splice(num_col,1,new_varibility); //還沒按lookup-button 所以num_col還是上一個

            if(j==num_col){

              for(k=0 ; k<table_f_rows_length ; k++){

                new_elements={
                  flow_Element: _flow_Element[k+1].value , fulfillment: _fulfillment[k+1].value , comlexity: _complexity[k+1].value , cost: _cost[k+1].value
                };
                // big_data[i].detail[j].element.push(new_elements);
                big_data[i].detail[j].element.splice(k,1, new_elements);

              }
            }

        }
      }

    }
    $('#export').text(JSON.stringify(big_data,undefined,'\t'));
    cal_LFEL();
    // U();
  },

  //**** flow table opertion ****//
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

  //**** varibiity table opertion ****//
  //calculate importance degree
  "change .b_degree":function(event){

    var b_degree_1=event.target.value; //.id   .className
    var i_degree_1=(b_degree_1)/2*weight_1;
    var $B_DEGREE_CLASS=$(event.target);
    $B_DEGREE_CLASS.parents().children('td:eq(4)').find('p').text(i_degree_1);  // for text in display
    $B_DEGREE_CLASS.parents().children('td').find('input:hidden.i_degree').val(i_degree_1); // for save to json
    temp2=b_degree_1;

    // recommend_strategy($B_DEGREE_CLASS,i_degree_1);
  },
  "change .weight":function(event){
    weight_1=event.target.value;
    var im_degree=(temp2)/2*weight_1;
    var msg_re_strategy;
    var temp3=im_degree;
    var $WEIGHT_CLASS=$(event.target);
    $(event.target).parents().children('td:eq(4)').find('p').text(im_degree);
    $WEIGHT_CLASS.parents().children('td').find('input:hidden.i_degree').val(im_degree);

    // recommend_strategy($WEIGHT_CLASS,temp3);
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
