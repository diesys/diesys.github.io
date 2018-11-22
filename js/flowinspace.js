viewport_h = $(window).height();
viewport_w = $(window).width();

if(viewport_h <= viewport_w) { 											// potrait
	$('#banner').css("height", viewport_h);	
}

// adjust bg div stars and navpanel to the draw height
$('#stars').css("height", $('#draw').height());
$('#navPanel').css("height", $('#draw').height());


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
			
			var starFlows = TweenMax.from($('#stars'), 5, {
				delay: .5,
				scale: 1.2,
				rotation: 15,
				ease: Power2.easeOut,
				transformOrigin: "50% 50%",
			});
			
			var spiral2Appear = TweenMax.fromTo($('#spiral1'), 1.5, {
				scale: .3,
				transformOrigin: "50% 50%",
				rotation: -120,
				opacity: 0
			}, {
				opacity: 1,
				scale: 1,
				transformOrigin: "50% 50%",
				ease: Power3.easeOut,
				delay: 0,
				rotation: 0
			});
			
			var spiral2Appear = TweenMax.fromTo($('#spiral2'), 1.5, {
				scale: .3,
				transformOrigin: "50% 50%",
				rotation: 120,
				opacity: 0,
			}, {
				opacity: 1,
				scale: 1,
				transformOrigin: "50% 50%",
				ease: Power2.easeOut,
				delay: 0,
				rotation: 0
			});

			var logoAppear = TweenMax.to($('#logo'), 1.9, {
				delay: .8,
				opacity: 1,
				scale: 1.3,
				ease: Elastic.easeOut
			});
			
			var writeAppear = TweenMax.fromTo($('#write'), 1.4, {
				opacity: 0,
        xPercent: -300,
        yPercent: 40,
			}, {
				delay: .8,
				opacity: 1,
				xPercent: 0,
        yPercent: 40,
				ease: Bounce.easeOut
			});
			
			var showMore = TweenMax.fromTo($('#showMore'), 1.7, {
				opacity: 0,
        yPercent: 100,
			}, {
				delay: 2.6,
				opacity: 1,
        yPercent: 0,
				ease: Elastic.easeOut
			});
			
			// number of showmore idle animation
			var count = 5;
			window.setInterval( function(){
				if (count) {
					TweenMax.fromTo($('#showMore'), 1, {
						yPercent: 10,
					}, {
						delay: 4,
						yPercent: 0,
						ease: Power2.easeOut
					});
					TweenMax.fromTo($('#showMore'), 1, {
						yPercent: 0,
					}, {
						delay: 6,
						yPercent: 10,
						ease: Power2.easeOut
					});
					count-=1;
				}
			}, 3000);
		});