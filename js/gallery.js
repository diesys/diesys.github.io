options = {
        // optionName: 'option value'
        // for example:
        index: 0 // start at first slide
    };

animazioni = [
    {	src: 'images/portfolio/animazioni/flyfishLogoTransitionOPT_big.gif',
        w: 580,
        h: 380
    }
]
banners = [
    {	src: 'images/portfolio/banner/aperiborda.jpg',
        w: 740,
        h: 280
    }
    , {	src: 'images/portfolio/banner/aperijam.jpg',
        w: 740,
        h: 280
    }
]
copertine = [
    {	src: 'images/portfolio/copertine/ateovirtuoso.png',
        w: 440,
        h: 710
    }
    , {	src: 'images/portfolio/copertine/cronache.jpg',
        w: 780,
        h: 380
    }
]
copertine = [
    {	src: 'images/portfolio/copertine/ateovirtuoso.png',
        w: 440,
        h: 710
    }
    , {	src: 'images/portfolio/copertine/cronache.jpg',
        w: 780,
        h: 380
    }
]
diffidente = [
    {	src: 'images/portfolio/diffidente/diffidente_banner.png',
        w: 680,
        h: 480
    }
    , {	src: 'images/portfolio/diffidente/diffidente1.png',
        w: 680,
        h: 480
    }
    , { src: 'images/portfolio/diffidente/diffidente2.png',
        w: 680,
        h: 480
    }
    , { src: 'images/portfolio/diffidente/diffidente3.png',
        w: 680,
        h: 480
    }
    , { src: 'images/portfolio/diffidente/diffidente4.png',
        w: 680,
        h: 480
    }
    , { src: 'images/portfolio/diffidente/diffidente5.png',
        w: 680,
        h: 480
    }
    , { src: 'images/portfolio/diffidente/diffidente6.png',
        w: 680,
        h: 480
    }
    , { src: 'images/portfolio/diffidente/diffidente7.png',
        w: 680,
        h: 480
    }
    , { src: 'images/portfolio/diffidente/diffidente8.png',
        w: 680,
        h: 480
    }
    , { src: 'images/portfolio/diffidente/ProtoCollo.png',
        w: 680,
        h: 480
    }
    , {	src: 'images/portfolio/diffidente/keepcalm1.png',
        w: 480,
        h: 680
    }
    , { src: 'images/portfolio/diffidente/keepcalm2.png',
        w: 480,
        h: 680
    }
    , { src: 'images/portfolio/diffidente/keepcalm3.png',
        w: 480,
        h: 680
    }
    , { src: 'images/portfolio/diffidente/keepcalm4.png',
        w: 480,
        h: 680
    }
    , { src: 'images/portfolio/diffidente/keepcalm5.png',
        w: 480,
        h: 680
    }
    , { src: 'images/portfolio/diffidente/keepcalm6.png',
        w: 480,
        h: 680
    }
    , { src: 'images/portfolio/diffidente/keepcalm7.png',
        w: 480,
        h: 680
    }
    , { src: 'images/portfolio/diffidente/keepcalm8.png',
        w: 480,
        h: 680
    }
]
adesivi = [
    {	src: 'images/portfolio/adesivi/aqara.png',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/adesivi/finoaqua.jpg',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/adesivi/kelevra.jpg',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/adesivi/eigenlab_circle.png',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/adesivi/hackmeeting0x13_timeline.png',
        w: 430,
        h: 300
    }
    , {
        src: 'images/portfolio/adesivi/hackmeeting0x13.png',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/adesivi/eigenlab_sketch.png',
        w: 430,
        h: 300
    }
];
striker = [
    {	src: 'images/portfolio/vario/anon_striker.png',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/vario/eigenlab_striker.png',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/vario/grafico_3d.png',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/vario/grafico.png',
        w: 300,
        h: 300
    }
    , {
        src: 'images/portfolio/vario/principessa.png',
        w: 300,
        h: 300
    }
]
icone = [{
    src: 'images/portfolio/icone/conversations.jpg',
    w: 400,
    h: 400
}]


var pswpElement = document.querySelectorAll('.pswp')[0];

document.getElementById('portfolioStickers').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, adesivi, options);
    gallery.init();
}

document.getElementById('portfolioAnimations').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, animazioni, options);
    gallery.init();
}

document.getElementById('portfolioStriker').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, striker, options);
    gallery.init();
}

document.getElementById('portfolioBanners').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, banners, options);
    gallery.init();
}

document.getElementById('portfolioCovers').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, copertine, options);
    gallery.init();
}

document.getElementById('portfolioDiffidente').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, diffidente, options);
    gallery.init();
}

document.getElementById('portfolioIcons').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, icone, options);
    gallery.init();
}

document.getElementById('portfolioPosters').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, locandine, options);
    gallery.init();
}

document.getElementById('portfolioLogos').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, loghi, options);
    gallery.init();
}

document.getElementById('portfolioShirts').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, magliette, options);
    gallery.init();
}

document.getElementById('portfolioBackgrounds').onclick = function () {
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, sfondi, options);
    gallery.init();
}