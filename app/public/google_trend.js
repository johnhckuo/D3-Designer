function search_trend(target_word, source) {
    alert("a");

    //if (source == 'search_bar') {
    //    target_word = $('#keyword').val();
    //}
    //$.ajax({
    //    type: 'post',
    //    url: 'http://localhost:3000/trend',
    //    data: JSON.stringify({ keyword: target_word }),
    //    contentType: "application/json",
    //    dataType: 'json',
    //    success: function (data) {
    //        trend_data = jQuery.parseJSON(data).default.rankedList[0].rankedKeyword;
    //        var table = d3.select('#trend_content');
    //        table.style('display', 'block');
    //        table.html('');
    //        var thead = table.append('thead').append('tr');
    //        thead.append('th')
    //             .text('Suggestion')
    //             .style('width', '50%');
    //        thead.append('th')
    //             .text('Search volume index')
    //             .style('width', '50%');
    //        var tbody = table.append('tbody');
    //        for (i = 0; i < trend_data.length; i++) {
    //            var tr = tbody.append('tr');
    //            tr.append('td').text(trend_data[i].query);
    //            tr.append('td').text(trend_data[i].value);
    //            tr.append('td').append('input')
    //                           .attr('type', 'button')
    //                           .attr('value', 'deeper')
    //                           .attr('onclick', 'search_trend("' + trend_data[i].query + '", "deeper");');
    //        }
    //        if (source == "deeper") {
    //            $("#keyword").val(target_word);
    //        }
    //    },
    //    //catch
    //    error: function (event) {
    //        alert(event);
    //    }
    //});
}