gsap.to("#bg", {
    scrollTrigger: {
        scrub: 1
    },
    scale: 1.2,
    y:100
})

gsap.to("#bg2", {
    scrollTrigger: {
        scrub: 1
    },
    scale: 1.2,
    y:-30
})
gsap.to("#bg3", {
    scrollTrigger: {
        scrub: 1
    },
    scale: 1.2,
    y:100
})

gsap.to("#logo", {
    scrollTrigger: {
        scrub: 1
    },
    scale: 1.2,
    y:900
})


gsap.to("#man", {
    scrollTrigger: {
        scrub: 1
    },
    scale: 1.3,
    y:250
})

gsap.to("#aire", {
    scrollTrigger: {
        scrub: 1
    },
    x:320,
    y:800,
    scale: 1.3
})


gsap.to("#fuego", {
    scrollTrigger: {
        scrub: 1
    },
    x:300,
    y:800,
    scale: 1.3

})

gsap.to("#tierra", {
    scrollTrigger: {
        scrub: 1
    },
    x:-350,
    y:800,
    scale: 1.3    
})

gsap.to("#agua", {
    scrollTrigger: {
        scrub: 1
    },
    x:-380,
    y:800,
    scale: 1.3   
})



gsap.to("#elementos", {
    scrollTrigger: {
        scrub: 1
    },
    y: "950%",
    onUpdate: function() {
        if (this.progress() > 0.5) {
            gsap.set("#elementos", {
                justifyContent: "flex-start",
                flexDirection: "column"
            });
        } else {
            gsap.set("#elementos", {
                justifyContent: "space-around",
                flexDirection: "row"
            });
        }
    }
});










gsap.to("#contenedor", {
    scrollTrigger: {
        scrub: 1
    },
    y: "100%",
    onUpdate: function() {
        if (this.progress() > 0.1) {
            gsap.set("#contenedor", {
                justifyContent: "flex-start",
                flexDirection: "column"
            });
        } else {
            gsap.set("#contenedor", {
                justifyContent: "space-around",
                flexDirection: "row",
            });
        }
    }
});