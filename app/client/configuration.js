
Template.configuration.events({
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
            alert(_keyword);
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
                                   .attr('class', 'trend_button')
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
