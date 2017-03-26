//google trend
function set_trend() {
    var trend = d3.select('#full_container').append('div')
                  .style('width', window.innerWidth - width - 50 + 'px')
                  .style('height', 600 + 'px')
                  .style('margin-top', 0 + 'px')
                  .style('margin-left', 520 + 'px');

    trend.append('input')
         .attr('type', 'text')
         .attr('id', 'keyword')
         .attr('size', 25);

    trend.append('input')
         .attr('type', 'button')
         .attr('value', 'search')
         .attr('id', 'get_trend')
         .attr('onclick', 'search_trend("' + $('#keyword').val() + '" ,"search_bar");');

    trend.append('table')
          .attr('id', 'trend_content')
          .attr('border', 1)
          .style('width', 600 + 'px')
          .style('display', 'none');
}

//¤å¦r´«¦æ
function wrap(text, width) {
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

//interaction
function add_interaction() {
    var tbody = d3.select('div.interaction_container')
                  .select('#item');

    var i = tbody[0][0].childNodes.length;
    var tr = d3.select('div.interaction_container')
                  .select('tbody').insert('tr');
    tr.append('td').append('input')
          .attr('type', 'text')
          .attr('id', 'interaction' + (i + 1))
          .attr('value', '');
    tr.append('td').append('input')
                      .attr('type', 'text')
                      .attr('id', 'give' + (i + 1))
                      .attr('value', '');
    tr.append('td').append('input')
                      .attr('type', 'text')
                      .attr('id', 'source_affect' + (i + 1))
                      .attr('value', '')
                      .attr('size', 2);
    tr.append('td').append('input')
                      .attr('type', 'text')
                      .attr('id', 'receive' + (i + 1))
                      .attr('value', '');
    tr.append('td').append('input')
                      .attr('type', 'text')
                      .attr('id', 'target_affect' + (i + 1))
                      .attr('value', '')
                      .attr('size', '2');
}