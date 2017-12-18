// Who Are You?
// by Justin Mo
/////////////////////////////////
var $h = $("html");

var client = {
	imageData: "",
	useType: "url",
	getFile: function(e) {
		e.preventDefault();
		console.log("getting file input");

		var file = document.getElementById("cameraInput").files[0];
		var reader = new FileReader();

		reader.addEventListener(
			"load",
			function() {
				var res = reader.result;

				// console.log('reader.result', res);
				$(".img-canvas").css("background-image", 'url("' + res + '")');
				// Convert to base 64 for use in query. Important!!!!!
				var b64 = res.replace(/^data:image\/(.*);base64,/, "");
				client.imageData = { base64: b64 };

				// Get Orientation of device
				if (userInfo.stats.orientation === "portrait") {
					$(".img-canvas").addClass("portrait");
					client.adjustBackground();
					$(".img-canvas").addClass("adjusted");
				}

				// Submit button pulse
				$("#submit").addClass("pulse");
			},
			false
		);

		if (file) {
			reader.readAsDataURL(file);
		}
	},
	getOrientation: function(type, img) {
		var orientation = window.screen.orientation.type;
		console.log("orientation", orientation);
		var split = orientation.split("-");
		return split[0];
	},
	adjustBackground: function(e) {
		$('.img-canvas').css('transform','rotate(' + 90 + 'deg)');
	},
	useTypeManager: function(type) {
		// Clear previous class before
		$h.removeClass("using-camera");
		$h.removeClass("using-url");
		$h.removeClass("using-file");

		if (type === "camera") {
			$h.addClass("using-camera");
			$h.attr("data-type", "camera");
		} else if (type === "url") {
			$h.addClass("using-url");
			$h.attr("data-type", "url");
		} else if (type === "file") {
			$h.addClass("using-file");
			$h.attr("data-type", "file");
		}
	},
	displayResults: function(age, value, gender, gendervalue, ethnicity, ethnicityvalue) {
		console.log("Display Results.");
		$(".result h2").text("Results");
		$(".modal-header").css("background-color", "#2ecc71");
		$("#age").text("Age: ").append(age);
		var html = $("#age").html();
		$("#age").html(html.replace(/Age:/gi, '<strong>$&</strong>'));
		$("#agecertainty").text("Certainty: ").append(parseInt(value.toFixed(2)*100) + "%");
		var html = $("#agecertainty").html();
		$("#agecertainty").html(html.replace(/Certainty:/gi, '<strong>$&</strong>'));
		$("#gender").text("Gender: ").append(gender);
		var html = $("#gender").html();
		$("#gender").html(html.replace(/Gender:/gi, '<strong>$&</strong>'));
		$("#gendercertainty").text("Certainty: ").append(parseInt(gendervalue.toFixed(2)*100) + "%");
		var html = $("#gendercertainty").html();
		$("#gendercertainty").html(html.replace(/Certainty:/gi, '<strong>$&</strong>'));
		$("#ethnicity").text("Ethnicity: ").append(ethnicity);
		var html = $("#ethnicity").html();
		$("#ethnicity").html(html.replace(/Ethnicity:/gi, '<strong>$&</strong>'));
		$("#ethnicitycertainty").text("Certainty: ").append(parseInt(ethnicityvalue.toFixed(2)*100) + "%");
		var html = $("#ethnicitycertainty").html();
		$("#ethnicitycertainty").html(html.replace(/Certainty:/gi, '<strong>$&</strong>'));
		$h.addClass("res");
	},
	isError: function() {
		console.log("------ ERROR ------");
		$(".result h2").text("Oops. Error.");
		$(".modal-header").css("background-color", "#e74c3c");
		$h.addClass("res");
	},
	clearResults: function() {
		$("#age").text("");
		$("#agecertainty").text("");
		$("#gender").text("");
		$("#gendercertainty").text("");
		$("#ethnicity").text("");
		$("#ethnicitycertainty").text("");
	},
	updatePhotoFromURL: function(e) {
		e.preventDefault();
		var imageData = $("#url_in").val();
		// $('#query-img').attr('src',imageData);
		$(".img-canvas").css(
			"background-image",
			"url(" + imageData + ")"
		);
		client.imageData = imageData;
	},
	submit: function(e) {
		e.preventDefault();
		console.log("submitted");

		$(this).removeClass("pulse"); // remove pulse

		// loading icon
		$(".preloader-wrapper").addClass("active");
		$(".loading-icon").addClass("active");

		// remove html result class
		$h.removeClass("res");
		$h.addClass("on-air"); // indicate data currently being sent

		
		var reqData = client.imageData;

		// Modify request depending on input type
		var itype = $h.attr("data-type");
		client.useType = itype;
		console.log('itype',itype);

		if (itype === "url") {
			reqData = $("#url_in").val().trim();
		} else if (itype === "camera") {
			console.log("camera input val");
		} else {
			return; // when empty?
		}
		
		
		
		console.log('reqData',reqData);
		
		$.ajax({
			type: "POST",
			data: {data: reqData},
			url: "/api/whoareyou",
			timeout: 5000
		}).done(function(result) {
			$(".preloader-wrapper").removeClass("active");
			$(".loading-icon").removeClass("active");

			if (result.error) {
				console.log("result.error", result.error);
				client.isError();
				client.clearResults();
			} else {
				client.displayResults(result.age, result.value, result.gender, result.gendervalue, result.ethnicity, result.ethnicityvalue);
			}
		}).fail(function(jqXHR, textStatus){
			if(textStatus === 'timeout')
			{     
				console.log("Timed Out.");
				$h.addClass("res");
				client.clearResults();
				$(".preloader-wrapper").removeClass("active");
				$(".loading-icon").removeClass("active");
				$(".result h2").text("Couldn't Detect Face.");
				$(".modal-header").css("background-color", "#e74c3c");
			}
		})
	}
};

// Listeners //////////////////////////////////////////////////
$("#rotate").on("click", client.adjustBackground);
$("#cameraInput").on("change", client.getFile); // Get file
$("#url_in").on("change", client.updatePhotoFromURL); // Update Photo Displayed in Canvas
$("#submit").on("click", client.submit); // Get image data from HTML
///////////////////////////////////////////////////////////////
$(".selectInputType").on("click", function(e) {
	e.preventDefault();
	$(".selectInputType").removeClass("selected");
	$(this).addClass("selected");

	var type = $(this).attr("data-type");
	client.useTypeManager(type);
});

// Trigger offscreen click
$("#useCamera").on("click", function(e) {
	e.preventDefault();
	$("#cameraInput").trigger("click");
});

//Close modal on click
$(".close").on("click", function(e) {
	$h.removeClass("res");
});

// Bind to Window object.
// window.clar = clar;
window.client = client;
