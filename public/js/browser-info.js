// var $h = $('html');

// function hadd(c){
// 	$('html').addClass(c);
// };

var userInfo = {
	report: function(){
		userInfo.getFlags();
		userInfo.flagHTML();
		userInfo.getOrientation();
		// console.log('userInfo.stats',userInfo.stats);
		return userInfo.stats;
	},
	stats: {
		flags: [],
		browser: bowser.name,
		version: bowser.version,
		osversion: bowser.osversion,
		orientation: 'landscape',
	},

	getFlags: function(){
				userInfo.stats.flags = [];
				for (var k in bowser) {
					var v = bowser[k];
					// Get flags
					if (v === true) {
						userInfo.stats.flags.push(k);
					}
				};
		},

	flagHTML: function(){
				var arr = userInfo.stats.flags;
				for (var i=0; i<arr.length; i++) {
						$('html').addClass('u-' + arr[i]);
				};
		},

	getOrientation: function(){
			  // Browser Orientation if supported
				if (window.screen){
					var orientation = window.screen.orientation.type;
					var split = orientation.split('-');
					userInfo.stats.orientation = split[0];
					// return split[0];
				}
				else {
					var w = window.innerHeight();
					var h = window.innerWidth();

					if (h > w){
						userInfo.stats.orientation = 'portrait';
						// return 'portrait';
					}
					else { 
						userInfo.stats.orientation = 'landscape';
						// return 'landscape'
					}
				}
	}
}

userInfo.report();
// console.log('stats',userInfo.stats);

// window.userInfo = user;