"use strict";

var controllers = require('./lib/controllers');
var YoutubeLite = {},
	    embed = '<div class="js-lazyYT" data-youtube-id="$5" data-width="640" data-height="360" data-start="$7"><iframe class="lazytube" src="//www.youtube.com/embed/$5$6$7"></iframe></div>',
		timeStamp = /t(\=\d+)/g,
		startParam = /&start=/g;

	var regularUrl = /(?:<p>|^)<a.*?href="((https?:\/\/(?:www\.)?)?youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|(https?:\/\/)?youtu\.be\/)(([a-zA-Z0-9_-]{6,11})(?:([&\?])(t\=\d+)s)?)"[^>]*?>\1\4<\/a>(?:<br\/?>|<\/p>)/gm;
YoutubeLite.regularUrl = regularUrl;

YoutubeLite.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;
		
	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/youtube-lite', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/youtube-lite', controllers.renderAdminPage);

	callback();
};

YoutubeLite.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/youtube-lite',
		icon: 'fa-youtube',
		name: 'Youtube Lite'
	});

	callback(null, header);
};

YoutubeLite.parse = function(data, callback) {
        if (!data || !data.postData || !data.postData.content) {
            return callback(null, data);
        }
        if (data.postData.content.match(regularUrl)) {
            data.postData.content = data.postData.content.replace(regularUrl, embed);
            data.postData.content = data.postData.content.replace(timeStamp, 'start$1');
            data.postData.content = data.postData.content.replace(startParam, '?start=');
        }
        callback(null, data);
    };

module.exports = YoutubeLite;
