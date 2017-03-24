import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
var flag = false;
var duration = 200;

window.onload = function(){

    $(document).scroll(function() {
      if ($(document).scrollTop() > $(window).innerHeight()) {
        $(".header").addClass("smallheader");
        // $("#logo").resize(50);
        if (flag){
          $("#logo").animate({
            width:50
          },duration);
        }
        flag = false;





        // $("#logo").animate({width:"50"});
      } else {
        if (!flag){
          $("#logo").animate({
            width:80
          },duration);
        }
        flag = true;

      }
    });

}
