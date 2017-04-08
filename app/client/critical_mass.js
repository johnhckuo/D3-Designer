

Template.critical_mass.onRendered(function () {
    d3.select('.vz-radial_progress-label').style('fill', '#FFFFFF').style('font-size', '40px').style('dominant-baseline', 'middle');
    $.getScript('critical_mass/canvasjs.min.js', function () { put_chart(); });
    $.getScript('critical_mass/materialize.min.js', function () { });
    $.getScript('critical_mass/theme_showreel.js', function () { });
    $.getScript('critical_mass/vizuly_core.min.js', function () { });
    $.getScript('critical_mass/vizuly_radialprogress.min.js', function () { });
    $.getScript('critical_mass/radialprogress_test.js', function () { set_wheel(); });
   
});

set_wheel = function () {
    //Keeps margins for examples not in iFrames.
    if (self == top) {
        d3.select("body").style("margin", "20px");
    }
        //Some house keeping for the display of test container for smaller screens
    else {
        d3.selectAll("li.logo").style("display", "none");
        d3.selectAll("div.container").style("margin-top", "-30px");
        d3.selectAll("i.mdi-navigation-menu").style("margin-top", "-10px")
    }

    //Set display size based on window size.
    var rect = document.body.getBoundingClientRect();
    screenWidth = (rect.width < 960) ? Math.round(rect.width * .95) : Math.round((rect.width - 210) * .95)

    d3.select("#currentDisplay").attr("value", screenWidth + ",600").attr("selected", true).text(screenWidth + "px - 600px");
    $('select').material_select(); //Materialize.css setup
    $(".button-collapse").sideNav({ menuWidth: 210 }); //
    viz_container = d3.selectAll("#viz_container")
        .style("width", screenWidth + "px")
        .style("height", "300px");

    initialize();
}

put_chart = function () {
    var chart = new CanvasJS.Chart("chartContainer",
{
    backgroundColor: "transparent",
    animationEnabled: true,
    axisX: {
        title: "Number of Design",

        minimum: 1,
        maximum: 10,
        interval: 1,
        gridColor: "#BFBFBF",
        tickColor: "#FFFFFF",
    },

    theme: "theme1",

    axisY: {
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
        { x: 2, y: 70 },
        { x: 3, y: 65 },
        { x: 4, y: 10 }
        ]
    },
    {
        type: "line",
        color: "#8E957D",
        dataPoints: [
        { x: 1, y: 10 },
        { x: 2, y: 50 },
        { x: 3, y: 80 },
        { x: 4, y: 10 }
        ]
    },
    {
        type: "line",
        color: "#BC9F77",
        dataPoints: [
        { x: 1, y: 40 },
        { x: 2, y: 70 },
        { x: 3, y: 98 },
        { x: 4, y: 10 }
        ]
    }
    ]
});
    chart.render();
}

Template.critical_mass.events({
    'click .fixBar': function (ev) {
        ev.preventDefault();
        $('.fixBarContent').addClass('active');
    },
    'click .fixBarContent a': function (ev) {
        ev.preventDefault();
        $('.fixBarContent').removeClass('active');
    }
});


