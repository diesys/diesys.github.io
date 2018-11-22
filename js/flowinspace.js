viewport_h = $(window).height();
viewport_w = $(window).width();

if(viewport_h > viewport_w) {
	new_height = viewport_h * 1;
	$('#banner').css("height", new_height);

	// $('#banner').css("transform", "5px");
} else {
	new_width = viewport_w * 1;
	$('#banner').css("width", new_width);

}

// $('#banner').css("left", "5px");

var allOpacity = TweenMax.set([$('#logo'), $('#write'), $('#stars'), $('#spiral1'), $('#spiral2')], {
	opacity: 0
});
var allOpacity = TweenMax.set($('#logo'), {
	scale: 0,
	transformOrigin: "50% 50%"
});

document.addEventListener('DOMContentLoaded', function () {
	// variables
			// var stars = $('#stars');
					// loading = $('#loading');
		

			var allOpacity = TweenMax.fromTo([$('#stars'), $('#spiral1'), $('#spiral2')], 1, {
				delay: 0,
				opacity: 0,
			}, {
				opacity: 1,
			}, .3);
			
			var starFlows = TweenMax.from($('#stars'), 15, {
				delay: .3,
				scale: .9,
				rotation: 5,
				ease: Elastic.easeOut,
				transformOrigin: "50% 50%",
			});
			
			var spiralsAppear = TweenMax.staggerFrom([$('#spiral1'), $('#spiral2')], 1, {
				delay: .3,
				scale: 0,
				ease: Elastic.easeOut,
				transformOrigin: "50% 50%",
			}, .4);

			var logoAppear = TweenMax.to($('#logo'), 2, {
				delay: 1.6,
				opacity: 1,
				scale: 1.2,
				ease: Elastic.easeOut
			});
			
			var logoAppear = TweenMax.fromTo($('#write'), 1.4, {
				opacity: 0,
        xPercent: -300,
        yPercent: 40,
			}, {
				delay: 2,
				opacity: 1,
				xPercent: 0,
        yPercent: 40,
				ease: Bounce.easeOut
			});
});