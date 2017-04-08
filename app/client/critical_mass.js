window.onload = function() {
var chart = new CanvasJS.Chart("chartContainer",
{
backgroundColor: "transparent",
animationEnabled: true,
  axisX:{
   title: "Number of Design",

   minimum: 1,
   maximum: 10,
   interval: 1,
   gridColor: "#BFBFBF",
   tickColor: "#FFFFFF",
  },

theme: "theme1",

axisY:{
   gridThickness: 0.5,
   gridColor: "#BFBFBF",
   tickLength: 8,
   tickThickness: 1.5,
   tickColor: "#FFFFFF",
},

legend: {
   verticalAlign: "center",
   horizontalAlign: "right"
                },
  data: [
  {
    type: "line",
    color: "#646A58",
    dataPoints: [
    { x: 1, y: 30 },
    { x: 2, y: 70},
    { x: 3, y: 65 },
    { x: 4, y: 10 }
    ]
  },
  {
    type: "line",
    color: "#8E957D",
    dataPoints: [
    { x: 1, y: 10 },
    { x: 2, y: 50},
    { x: 3, y: 80 },
    { x: 4, y: 10 }
    ]
  },
  {
    type: "line",
    color: "#BC9F77",
    dataPoints: [
    { x: 1, y: 40 },
    { x: 2, y: 70},
    { x: 3, y: 98 },
    { x: 4, y: 10 }
    ]
  }
  ]
});

chart.render();
d3.select('.vz-radial_progress-label').style('fill', '#FFFFFF').style('font-size','40px').style('dominant-baseline','middle');
}



	$('.fixBar').click(function(ev){
		ev.preventDefault();

		$('.fixBarContent').addClass('active');
	});

	$('.fixBarContent a').click(function(ev){
		ev.preventDefault();

		$('.fixBarContent').removeClass('active');
	});
