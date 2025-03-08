document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("juegoCanvas");
    const ctx = canvas.getContext("2d");

    let objetivo = {
        x: 0,
        y: 0,
        radio: 20,
    };

    function nuevoObjetivo() {
        objetivo.x = Math.random() * (canvas.width - 2 * objetivo.radio) + objetivo.radio;
        objetivo.y = Math.random() * (canvas.height - 2 * objetivo.radio) + objetivo.radio;
    }

    function dibujarObjetivo() {
        ctx.clearRect(0,0, canvas.widht, canvas.height);
        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.arc(objetivo.x, objetivo.y, objetivo.radio,0,Math.PI*2);
        ctx.fill(); 
    }

    function clicEnObjetivo(evento) {
        const distancia = Math.sqrt(
            Math.pow(evento.clientX - objetivo.x, 2) + Math.pow(evento.clientY - objetivo.y,2)
        );

        if (distancia < objetivo.radio){
            alert("Has Atrapado al objetivo!");
            nuevoObjetivo();
        }
    }

    canvas.addEventListener("click", clickEnObjetivo);

    nuevoObjetivo();
    dibujarObjetivo();

});