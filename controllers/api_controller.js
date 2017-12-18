"use strict";
(function() {
	const express = require("express");
	const router = express.Router();
	const bodyParser = require("body-parser");
	const Clarifai = require('clarifai');
	const app = new Clarifai.App({
	 apiKey: 'ed2d3ddb39a148f594d8bce47de2a8e4'
	});
//==================================================
	router.post('/api/whoareyou', function(req,res){
		console.log('------------ POST /api/whoareyou ----------->');
		// console.log('req.body',req.body);
		let imageData = req.body.data;
		// if (req.body.url){
		// 	imageData = req.body.url;
		// }
		// else {
		// 	imageData = req.body;
		// }
		console.log('imageData',imageData);
		
		// predict the contents of an image by passing in a url
		app.models.predict(Clarifai.DEMOGRAPHICS_MODEL, imageData).then(
			function(response) {
				let { outputs } = response;				
				let conc = outputs[0].data.regions[0].data.face.age_appearance.concepts;
				let gender = outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].name;
				let gendervalue = outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].value;
				let ethnicity = outputs[0].data.regions[0].data.face.multicultural_appearance.concepts[0].name;
				let ethnicityvalue = outputs[0].data.regions[0].data.face.multicultural_appearance.concepts[0].value;
				console.log('===> RESPONSE ====',conc);					
					
						let age = 0;
						let value = 0;
						for (var i=0; i<conc.length; i++) {
							age +=  parseInt(conc[i].name);
							value += conc[i].value;
						}
						res.json({ age: age/conc.length, value: value/conc.length, gender: gender, gendervalue: gendervalue, ethnicity: ethnicity, ethnicityvalue: ethnicityvalue })
						console.log("age: " + age/conc.length + ", certainty: " + value/conc.length);
			},
			function(err) {
				console.log('===> ERROR ====', err.status, err.statusText);
				res.json({ error: true })
			}
		);
	})


//==================================================
	module.exports = router; // Export routes for server.js to use.
////////////////////////////////////////////////////
})();
