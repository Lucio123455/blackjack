//Variables globales del blackJack
const NUMERO_MAXIMO = 21
const RONDAS_NECESARIAS_PARA_COMENZAR = 2
const AS = 1
const valorDelAsAdicional = 11

let cartasDelJugador = []
let cartasDeLaMaquina = []
let sumaDelJugador = 0
let sumaDeLaMaquina = 0
let ronda = RONDAS_NECESARIAS_PARA_COMENZAR
let sePlanto = false
let terminoElGame = true
let comenzoElGame = false
let saldo = parseInt(localStorage.getItem('saldo')) || 5000;
let apuesta = 0

const saldoEnPantalla = document.getElementById("valorSaldo")
const apuestaEnPantalla = document.getElementById("valorApuesta")
const cartasJugadorMostrar = document.getElementById("cartasJugador");
const cartasMaquinaMostrar = document.getElementById("cartasMaquina");
const resultado = document.getElementById("resultado");
saldoEnPantalla.textContent = saldo

// ARRAY DE OBJETOS CARTAS
let palos = ['pica', 'corazón', 'diamante', 'trébol'];
let cartas = [];
for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < palos.length; j++) {
        cartas.push({ numero: i, palo: palos[j] });
    }
}
let letras = ['J', 'Q', 'K'];
for (let k = 0; k < letras.length; k++) {
    for (let l = 0; l < palos.length; l++) {
        cartas.push({numero: 10, letra: letras[k], palo: palos[l] });
    }
}

//FUNCIONES RELACIONADAS SALDOS Y APUESTA
function actualizarSaldo(nuevoSaldo) {
    saldo = nuevoSaldo;
    localStorage.setItem('saldo', saldo.toString());
}

const valorDeLaRecargaDelSaldo = 1000

function recargarSaldo(){
    if (comenzoElGame === false) {
        saldo +=valorDeLaRecargaDelSaldo
        saldoEnPantalla.textContent = saldo
        actualizarSaldo(saldo)
    }
}

const valorDeLaApuestaGenerica = 100

function apostar() {
    if (comenzoElGame === false && saldo > 0) {
        apuesta += valorDeLaApuestaGenerica;
        apuestaEnPantalla.textContent = apuesta;
        restarSaldo();
    }
}

function borrarApuesta(){
    if (comenzoElGame === false) {
        saldo += apuesta
        saldoEnPantalla.textContent = saldo
        apuesta = 0;
        apuestaEnPantalla.textContent = apuesta;
    }
}

function restarSaldo() {
    if (comenzoElGame === false) {
        saldo -= valorDeLaApuestaGenerica;
        saldoEnPantalla.textContent = saldo;
    }
}

let intervaloApostar;

function iniciarApostar() {
    apostar();  
    intervaloApostar = setInterval(apostar, 100);  
}

function detenerApostar() {
    clearInterval(intervaloApostar);  
}

function modificarSaldo() {
    saldoEnPantalla.textContent = saldo
    actualizarSaldo(saldo)
}

//FUNCIONES PRINCIPALES PARA EL FUNCIONAMIENTO DEL JUEGO
function jugarPartida() {
    if (terminoElGame === true) {
        cartasDelJugador = []
        cartasDeLaMaquina = []
        sumaDelJugador = 0
        sumaDeLaMaquina = 0
        ronda = RONDAS_NECESARIAS_PARA_COMENZAR
        sePlanto = false
        cartasJugadorMostrar.textContent = "";
        cartasMaquinaMostrar.textContent = "";
        resultado.textContent = "";
        actualizarSaldo(saldo)
        iniciarJuego()
    }
}

function iniciarJuego() {
    sumaDelJugador = comienzoDePartidaDom(cartasDelJugador, cartasDeLaMaquina)
    terminoElGame = false
    comenzoElGame = true
    if (sumaDelJugador === NUMERO_MAXIMO) {
        resultadoBlackJack(primeraSuma,sumaDeLaMaquina)
        sePlanto = true
    }
}

function comienzoDePartidaDom(cartasDelJugador, cartasDeLaMaquina) {
    for (let i = 0; i < RONDAS_NECESARIAS_PARA_COMENZAR; i++) {
        cartasDeLaMaquina[i] = repartirCarta()
        cartasDelJugador[i] = repartirCarta()
    }
    informarCartasDelComienzoDeLaPartidaDom(cartasDelJugador, cartasDeLaMaquina)
    primeraSuma = sumarCartasDelComienzoDePartida(cartasDelJugador)
    mostrarSumaDom(primeraSuma, cartasDelJugador)
    mostrarSumaMaquinaDom(cartasDeLaMaquina[0], cartasDeLaMaquina)
    return primeraSuma
}

function informarCartasDelComienzoDeLaPartidaDom(cartasDelJugador, cartasDeLaMaquina) {
    for (let i = 0; i < RONDAS_NECESARIAS_PARA_COMENZAR; i++) {
        mostrarCartaJugadorDom(cartasDelJugador[i]);
    }   
    mostrarCartaMaquinaDom(cartasDeLaMaquina[0]);
}

function sumarCartasDelComienzoDePartida(cartas) {
    const casoDeDosOnces = 22
    let suma = 0
    for (let i = 0; i < RONDAS_NECESARIAS_PARA_COMENZAR; i++) {
        if (cartas[i] === AS) {
            cartas[i] = valorDelAsAdicional
        }
        suma += cartas[i]
    }
    if (suma === casoDeDosOnces) {
        suma = suma - 10
        cartas[0] = NaN
    }
    return suma
}

const LIMITE_CARTAS = 8

function pedirCarta() {
    if (comenzoElGame === true && ronda < LIMITE_CARTAS && sumaDelJugador < NUMERO_MAXIMO && sePlanto === false) {
        cartasDelJugador[ronda] = repartirCarta();
        mostrarCartaJugadorDom(cartasDelJugador[ronda]);
        sumarCartasDelJugador();

        if (sumaDelJugador > NUMERO_MAXIMO) {
            resultadoBlackJack(sumaDelJugador, sumaDeLaMaquina)
            sePlanto = true
        }
        ronda++;
    }
}

function plantarse() {
    ronda = 1
    if (comenzoElGame === true && sumaDelJugador <= NUMERO_MAXIMO && sePlanto === false) {
        mostrarCartaMaquinaDom(cartasDeLaMaquina[ronda])
        sePlanto = true
        sumaDeLaMaquina = sumarCartasDelComienzoDePartida(cartasDeLaMaquina)
        mostrarSumaMaquinaDom(sumaDeLaMaquina, cartasDeLaMaquina)
        ronda++
        while (sumaDeLaMaquina < NUMERO_MAXIMO && sumaDeLaMaquina < sumaDelJugador) {
            cartasDeLaMaquina[ronda] = repartirCarta()
            mostrarCartaMaquinaDom(cartasDeLaMaquina[ronda])
            sumaDeLaMaquina = sumarCartaConIndexOF(sumaDeLaMaquina, cartasDeLaMaquina, ronda)
            mostrarSumaMaquinaDom(sumaDeLaMaquina, cartasDeLaMaquina)
            ronda++
        }
        resultadoBlackJack(sumaDelJugador, sumaDeLaMaquina)
    }
}

function sumarCartasDelJugador() {
    sumaDelJugador = sumarCartaConIndexOF(sumaDelJugador, cartasDelJugador, ronda);
    mostrarSumaDom(sumaDelJugador, cartasDelJugador);
}

function sumarCartaConIndexOF(suma, cartas, ronda) {
    suma = suma + cartas[ronda];
    let indiceAs = cartas.lastIndexOf(AS);

    if (indiceAs !== -1) {
        cartas[indiceAs] = valorDelAsAdicional;
        suma = suma + 10;
    }

    if (suma > NUMERO_MAXIMO) {
        let indiceAsAdicional = cartas.lastIndexOf(valorDelAsAdicional);
        if (indiceAsAdicional !== -1) {
            cartas[indiceAsAdicional] = NaN;
            suma = suma - 10;
        }
    }

    return suma;
}

function resultadoBlackJack(sumaDelJugador, sumaDeLaMaquina) {
    if (sumaDelJugador > NUMERO_MAXIMO) {
        resultado.textContent = "PERDISTE";
        resultado.className = "resultado-perdido";
        saldo = saldo;
    }else if(sumaDelJugador === NUMERO_MAXIMO && cartasDelJugador.length === 2){
        resultado.textContent = "GANASTE";
        resultado.className = "resultado-ganado";
        saldo = saldo + apuesta * 2.5;
    } else if (sumaDeLaMaquina > NUMERO_MAXIMO) {
        resultado.textContent = "GANASTE";
        resultado.className = "resultado-ganado";
        saldo = saldo + apuesta * 2;
    } else if (sumaDelJugador === sumaDeLaMaquina) {
        resultado.textContent = "EMPATE";
        resultado.className = "resultado-empate";
        saldo = saldo + apuesta;
    } else if (sumaDelJugador > sumaDeLaMaquina) {
        resultado.textContent = "GANASTE";
        resultado.className = "resultado-ganado";
        saldo = saldo + apuesta * 2;
    } else if (sumaDeLaMaquina > sumaDelJugador) {
        resultado.textContent = "PERDISTE";
        resultado.className = "resultado-perdido";
        saldo = saldo;
    }

    terminoElGame = true
    comenzoElGame = false
    apuesta = 0
    apuestaEnPantalla.textContent = 0
    modificarSaldo()
}

function mostrarSumaDom(suma, cartas) {
    let yaSalioUnOnce = cartas.lastIndexOf(valorDelAsAdicional);
    const sumaJugador = document.getElementById("sumaJugador")
    if (yaSalioUnOnce !== -1) {
        sumaJugador.textContent = suma + " o " + (suma - 10);
    } else {
        sumaJugador.textContent = suma
    }
}

function mostrarSumaMaquinaDom(suma, cartas) {
    let yaSalioUnOnce = cartas.lastIndexOf(valorDelAsAdicional);
    const sumaMaquina = document.getElementById("sumaMaquina")
    if (yaSalioUnOnce !== -1) {
        sumaMaquina.textContent = suma + " o " + (suma - 10);
    } else {
        sumaMaquina.textContent = suma
    }
    if (cartas.length === 2 && cartas[0] === 1) {
        sumaMaquina.textContent = "11 o " + cartas[0]
    }
}

function mostrarCartaJugadorDom(carta) {
    cartasJugadorMostrar.innerHTML += carta + "&nbsp;&nbsp;&nbsp;&nbsp;";
}

function mostrarCartaMaquinaDom(carta) {
    cartasMaquinaMostrar.innerHTML += carta + "&nbsp;&nbsp;&nbsp;&nbsp;"; 
}

const CARTAS_MAZO = 52

function repartirCarta() {
    let indiceCarta = Math.floor(Math.random() * CARTAS_MAZO);
    return cartas[indiceCarta].numero
}

//INSTRUCCIONES

let noMostrarMas = localStorage.getItem('noMostrarMas');
noMostrarMas = JSON.parse(localStorage.getItem('noMostrarMas')) || false;

function mostrarInstruccionesDesdeElJuego(){
    document.getElementById('instrucciones-container').style.display = 'block';
    document.getElementById('no-mostrar-mas').style.display = 'none';
}

function mostrarInstrucciones() {
    if (noMostrarMas === false) {
        document.getElementById('instrucciones-container').style.display = 'block';
    } 
}

function cerrarInstrucciones() {
    document.getElementById('instrucciones-container').style.display = 'none';
}

function noMostrarMasFuncion(){
    cerrarInstrucciones();
    localStorage.setItem('noMostrarMas', JSON.stringify(true));
}

mostrarInstrucciones();

