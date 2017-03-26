import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.methods({
        get_trend:function(req){
            const googleTrends = require('google-trends-api');
            var _keyword = req.keyword;
            console.log("aaa" + _keyword);
            //function async(){
            //    retrun googleTrends.relatedQueries({keyword:  _keyword});
            //}
            var temp = Meteor.wrapAsync(googleTrends.relatedQueries); 
            var res = temp({keyword:  _keyword});
            return (res);

            },

    });
});

