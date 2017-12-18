"use strict";
(function() {
	const express = require("express");
	const router = express.Router();
	const bodyParser = require("body-parser");

//==================================================
	router.get("/", function(req, res) {
		// res.redirect('/under-construction');
		res.render('way', {
			title: 'Who Are You?'
		})
	});

	//==================================================
	module.exports = router; // Export routes for server.js to use.
	////////////////////////////////////////////////////
})();
