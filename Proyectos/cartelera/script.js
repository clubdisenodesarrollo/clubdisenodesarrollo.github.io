window.onscroll = function(){

    var posicion = window.pageYOffset || document.documentElement.scrollTop;

    var elemento1 = document.getElementById("icon_pop");
    var elemento2 = document.getElementById("icon_locura");

    elemento1.style.bottom = posicion * 0.2 + "px";
    elemento2.style.top = posicion * 0.05 + "px";

}


gsap.to("#laMonjaSilueta2", {
    scrollTrigger: {
        scrub: 1
    },
    scale: 8, opacity:20})