// ==================================================
// MODELADOR DE GRAFOS
// APP
// ==================================================


// ==================================================
// OBJETOS PRINCIPALES
// ==================================================

const svg =
    document.getElementById(
        "lienzo"
    );


const grafo =
    new Grafo();


const renderizador =
    new Renderizador(
        svg
    );


// ==================================================
// UI - MENÚ CONTEXTUAL
// ==================================================

const menuContextual =
    document.getElementById(
        "menu-contextual"
    );


const btnEliminarElemento =
    document.getElementById(
        "btn-eliminar-elemento"
    );


// ==================================================
// UI - MODAL DE NODO
// ==================================================

const menuNodo =
    document.getElementById(
        "menu-nodo"
    );


const inputEtiquetaNodo =
    document.getElementById(
        "nodo-etiqueta"
    );


const paletaColores =
    document.getElementById(
        "paleta-colores"
    );


const inputRadioNodo =
    document.getElementById(
        "nodo-radio"
    );


const btnGuardarNodo =
    document.getElementById(
        "btn-guardar-nodo"
    );


const btnCancelarNodo =
    document.getElementById(
        "btn-cancelar-nodo"
    );


// ==================================================
// UI - MODAL DE ARISTA
// ==================================================

const menuArista =
    document.getElementById(
        "menu-arista"
    );


const inputPesoSimple =
    document.getElementById(
        "arista-peso"
    );


const campoPesoSimple =
    document.getElementById(
        "campo-peso-simple"
    );


const campoPesosBidi =
    document.getElementById(
        "campo-pesos-bidireccionales"
    );


const btnGuardarArista =
    document.getElementById(
        "btn-guardar-arista"
    );


const btnCancelarArista =
    document.getElementById(
        "btn-cancelar-arista"
    );


// ==================================================
// UI - BOTÓN MATRIZ
// ==================================================

const btnMatriz =
    document.getElementById(
        "btn-matriz"
    );


// ==================================================
// ESTADO DE INTERACCIÓN
// ==================================================

let nodoInicial =
    null;


let posicionInicial =
    null;


let huboMovimiento =
    false;


let punteroActivo =
    null;


// ==================================================
// SOPORTE TOQUE LARGO
// ==================================================

let temporizadorLongPress =
    null;


let posicionPunteroAbsoluta = {
    x: 0,
    y: 0
};


// ==================================================
// VARIABLES DE SELECCIÓN Y EDICIÓN
// ==================================================

let elementoSeleccionado =
    null;


let nodoEnEdicion =
    null;


let aristaEnEdicion =
    null;


let colorNodoSeleccionado =
    "#4CAF50";


// ==================================================
// INICIALIZAR
// ==================================================

inicializar();


function inicializar() {

    configurarEventos();

    renderizador.dibujarGrafo(
        grafo
    );
}


// ==================================================
// CONFIGURAR EVENTOS
// ==================================================

function configurarEventos() {

    // ----------------------------------
    // EVENTOS DEL SVG
    // ----------------------------------

    svg.addEventListener(
        "pointerdown",
        manejarPointerDown
    );


    svg.addEventListener(
        "pointermove",
        manejarPointerMove
    );


    svg.addEventListener(
        "pointerup",
        manejarPointerUp
    );


    svg.addEventListener(
        "pointercancel",
        manejarPointerCancel
    );


    svg.addEventListener(
        "contextmenu",
        manejarContextMenu
    );


    // ----------------------------------
    // ELIMINAR ELEMENTO
    // ----------------------------------

    btnEliminarElemento.addEventListener(
        "click",
        ejecutarEliminacion
    );


    // ----------------------------------
    // CERRAR MENÚ CONTEXTUAL
    // ----------------------------------

    document.addEventListener(
        "pointerdown",
        (e) => {

            if (
                menuContextual &&
                !menuContextual.contains(
                    e.target
                )
            ) {

                menuContextual.classList.add(
                    "oculto"
                );
            }
        }
    );


    // ==================================================
    // MODAL NODO
    // ==================================================

    btnGuardarNodo.addEventListener(
        "click",
        guardarEdicionNodo
    );


    btnCancelarNodo.addEventListener(
        "click",
        () => {

            menuNodo.classList.add(
                "oculto"
            );

            nodoEnEdicion = null;
        }
    );


    // ----------------------------------
    // PALETA DE COLORES
    // ----------------------------------

    if (
        paletaColores
    ) {

        paletaColores
            .querySelectorAll(
                ".opcion-color"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        (e) => {

                            paletaColores
                                .querySelectorAll(
                                    ".opcion-color"
                                )
                                .forEach(
                                    btn =>
                                        btn.classList.remove(
                                            "seleccionado"
                                        )
                                );


                            const btnActual =
                                e.currentTarget;


                            btnActual.classList.add(
                                "seleccionado"
                            );


                            colorNodoSeleccionado =
                                btnActual.dataset.color;
                        }
                    );
                }
            );
    }


    // ==================================================
    // MODAL ARISTA
    // ==================================================

    btnGuardarArista.addEventListener(
        "click",
        guardarEdicionArista
    );


    btnCancelarArista.addEventListener(
        "click",
        () => {

            menuArista.classList.add(
                "oculto"
            );

            aristaEnEdicion = null;
        }
    );


    // ----------------------------------
    // TIPO DE ARISTA
    // ----------------------------------

    document
        .querySelectorAll(
            'input[name="tipo-arista"]'
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    actualizarCamposPesoModal
                );
            }
        );


    // ----------------------------------
    // BOTÓN MATRIZ
    // ----------------------------------

    if (
        btnMatriz
    ) {

        btnMatriz.addEventListener(
            "click",
            () => {

                console.log(
                    "Botón Matriz presionado"
                );
            }
        );
    }
}


// ==================================================
// POINTER DOWN
// ==================================================

function manejarPointerDown(
    evento
) {

    if (
        evento.button !== 0 &&
        evento.pointerType === "mouse"
    ) {

        return;
    }


    punteroActivo =
        evento.pointerId;


    posicionPunteroAbsoluta = {
        x: evento.clientX,
        y: evento.clientY
    };


    const elemento =
        evento.target;


    const grupoNodo =
        elemento.closest(
            '[data-tipo="nodo"]'
        );


    const grupoArista =
        elemento.closest(
            '[data-tipo="arista"]'
        );


    posicionInicial =
        obtenerPosicionSVG(
            evento
        );


    huboMovimiento =
        false;


    // ----------------------------------
    // NODO
    // ----------------------------------

    if (
        grupoNodo
    ) {

        elementoSeleccionado = {
            tipo: "nodo",
            id: grupoNodo.dataset.id
        };


        nodoInicial =
            grafo.obtenerNodoPorId(
                grupoNodo.dataset.id
            );


        svg.setPointerCapture(
            evento.pointerId
        );
    }


    // ----------------------------------
    // ARISTA
    // ----------------------------------

    else if (
        grupoArista
    ) {

        elementoSeleccionado = {
            tipo: "arista",
            id: grupoArista.dataset.id
        };


        nodoInicial =
            null;
    }


    // ----------------------------------
    // ESPACIO VACÍO
    // ----------------------------------

    else {

        elementoSeleccionado =
            null;

        nodoInicial =
            null;
    }


    // ----------------------------------
    // LONG PRESS
    // ----------------------------------

    cancelarLongPress();


    if (
        elementoSeleccionado
    ) {

        temporizadorLongPress =
            setTimeout(
                () => {

                    abrirMenuContextual(
                        posicionPunteroAbsoluta.x,
                        posicionPunteroAbsoluta.y
                    );

                },
                600
            );
    }
}


// ==================================================
// POINTER MOVE
// ==================================================

function manejarPointerMove(
    evento
) {

    if (
        evento.pointerId !==
        punteroActivo
    ) {

        return;
    }


    const posicion =
        obtenerPosicionSVG(
            evento
        );


    posicionPunteroAbsoluta = {
        x: evento.clientX,
        y: evento.clientY
    };


    if (
        posicionInicial
    ) {

        const dx =
            posicion.x -
            posicionInicial.x;


        const dy =
            posicion.y -
            posicionInicial.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia > 6
        ) {

            huboMovimiento =
                true;


            cancelarLongPress();
        }
    }
}


// ==================================================
// POINTER UP
// ==================================================

function manejarPointerUp(
    evento
) {

    if (
        evento.pointerId !==
        punteroActivo
    ) {

        return;
    }


    cancelarLongPress();


    const posicionFinal =
        obtenerPosicionSVG(
            evento
        );


    const elementoFinal =
        document.elementFromPoint(
            evento.clientX,
            evento.clientY
        );


    const grupoArista =
        elementoFinal?.closest(
            '[data-tipo="arista"]'
        );


    // ==================================================
    // CREAR NODO
    // ==================================================

    if (
        !nodoInicial &&
        !huboMovimiento &&
        !grupoArista
    ) {

        grafo.crearNodo(
            posicionFinal.x,
            posicionFinal.y
        );


        renderizador.dibujarGrafo(
            grafo
        );


        limpiarInteraccion();

        return;
    }


    // ==================================================
    // EDITAR NODO
    // ==================================================

    if (
        nodoInicial &&
        !huboMovimiento
    ) {

        abrirEdicionNodo(
            nodoInicial.id
        );


        limpiarInteraccion();

        return;
    }


    // ==================================================
    // EDITAR ARISTA
    // ==================================================

    if (
        !nodoInicial &&
        !huboMovimiento &&
        grupoArista
    ) {

        abrirEdicionArista(
            grupoArista.dataset.id
        );


        limpiarInteraccion();

        return;
    }


    // ==================================================
    // CREAR ARISTA O MOVER NODO
    // ==================================================

    if (
        nodoInicial &&
        huboMovimiento
    ) {

        const grupoNodoFinal =
            elementoFinal?.closest(
                '[data-tipo="nodo"]'
            );


        // ----------------------------------
        // CREAR ARISTA
        // ----------------------------------

        if (
            grupoNodoFinal
        ) {

            const nodoFinal =
                grafo.obtenerNodoPorId(
                    grupoNodoFinal.dataset.id
                );


            if (
                nodoFinal
            ) {

                grafo.crearArista(
                    nodoInicial,
                    nodoFinal
                );
            }
        }


        // ----------------------------------
        // MOVER NODO
        // ----------------------------------

        else {

            nodoInicial.cambiarPosicion(
                posicionFinal.x,
                posicionFinal.y
            );
        }


        renderizador.dibujarGrafo(
            grafo
        );
    }


    limpiarInteraccion();
}


// ==================================================
// POINTER CANCEL
// ==================================================

function manejarPointerCancel() {

    cancelarLongPress();

    limpiarInteraccion();
}


// ==================================================
// MENÚ CONTEXTUAL
// ==================================================

function manejarContextMenu(
    evento
) {

    evento.preventDefault();

    cancelarLongPress();


    const objetivo =
        evento.target;


    const grupoNodo =
        objetivo.closest(
            '[data-tipo="nodo"]'
        );


    const grupoArista =
        objetivo.closest(
            '[data-tipo="arista"]'
        );


    if (
        grupoNodo
    ) {

        elementoSeleccionado = {
            tipo: "nodo",
            id: grupoNodo.dataset.id
        };
    }


    else if (
        grupoArista
    ) {

        elementoSeleccionado = {
            tipo: "arista",
            id: grupoArista.dataset.id
        };
    }


    else {

        elementoSeleccionado =
            null;


        menuContextual.classList.add(
            "oculto"
        );


        return;
    }


    abrirMenuContextual(
        evento.clientX,
        evento.clientY
    );
}


// ==================================================
// ABRIR MENÚ CONTEXTUAL
// ==================================================

function abrirMenuContextual(
    x,
    y
) {

    if (
        !elementoSeleccionado
    ) {

        return;
    }


    menuContextual.style.left =
        `${x}px`;


    menuContextual.style.top =
        `${y}px`;


    menuContextual.classList.remove(
        "oculto"
    );
}


// ==================================================
// ELIMINAR ELEMENTO
// ==================================================

function ejecutarEliminacion() {

    if (
        !elementoSeleccionado
    ) {

        return;
    }


    if (
        elementoSeleccionado.tipo ===
        "nodo"
    ) {

        grafo.eliminarNodo(
            elementoSeleccionado.id
        );
    }


    else if (
        elementoSeleccionado.tipo ===
        "arista"
    ) {

        grafo.eliminarArista(
            elementoSeleccionado.id
        );
    }


    elementoSeleccionado =
        null;


    menuContextual.classList.add(
        "oculto"
    );


    renderizador.dibujarGrafo(
        grafo
    );
}


// ==================================================
// EDITAR NODO
// ==================================================

function abrirEdicionNodo(
    idNodo
) {

    nodoEnEdicion =
        grafo.obtenerNodoPorId(
            idNodo
        );


    if (
        !nodoEnEdicion
    ) {

        return;
    }


    inputEtiquetaNodo.value =
        nodoEnEdicion.etiqueta;


    inputRadioNodo.value =
        nodoEnEdicion.radio;


    colorNodoSeleccionado =
        nodoEnEdicion.color;


    if (
        paletaColores
    ) {

        paletaColores
            .querySelectorAll(
                ".opcion-color"
            )
            .forEach(
                btn => {

                    if (
                        btn.dataset.color ===
                        nodoEnEdicion.color
                    ) {

                        btn.classList.add(
                            "seleccionado"
                        );
                    }

                    else {

                        btn.classList.remove(
                            "seleccionado"
                        );
                    }
                }
            );
    }


    menuNodo.classList.remove(
        "oculto"
    );
}


// ==================================================
// GUARDAR EDICIÓN NODO
// ==================================================

function guardarEdicionNodo() {

    if (
        !nodoEnEdicion
    ) {

        return;
    }


    nodoEnEdicion.cambiarEtiqueta(
        inputEtiquetaNodo.value
    );


    nodoEnEdicion.cambiarColor(
        colorNodoSeleccionado
    );


    nodoEnEdicion.cambiarRadio(
        inputRadioNodo.value
    );


    menuNodo.classList.add(
        "oculto"
    );


    nodoEnEdicion =
        null;


    renderizador.dibujarGrafo(
        grafo
    );
}


// ==================================================
// EDITAR ARISTA
// ==================================================

function abrirEdicionArista(
    idArista
) {

    aristaEnEdicion =
        grafo.obtenerAristaPorId(
            idArista
        );


    if (
        !aristaEnEdicion
    ) {

        return;
    }


    // ----------------------------------
    // SELECCIONAR TIPO
    // ----------------------------------

    const radioTipo =
        document.querySelector(
            `input[name="tipo-arista"][value="${aristaEnEdicion.tipo}"]`
        );


    if (
        radioTipo
    ) {

        radioTipo.checked =
            true;
    }


    // ----------------------------------
    // PESO
    // ----------------------------------

    inputPesoSimple.value =
        aristaEnEdicion.peso !== null
            ? aristaEnEdicion.peso
            : "";


    // ----------------------------------
    // ACTUALIZAR CAMPOS
    // ----------------------------------

    actualizarCamposPesoModal();


    // ----------------------------------
    // MOSTRAR MODAL
    // ----------------------------------

    menuArista.classList.remove(
        "oculto"
    );
}


// ==================================================
// ACTUALIZAR CAMPOS DE PESO
// ==================================================

function actualizarCamposPesoModal() {

    const tipo =
        document.querySelector(
            'input[name="tipo-arista"]:checked'
        )?.value;


    // ----------------------------------
    // BIDIRECCIONAL YA NO EXISTE
    // ----------------------------------

    if (
        tipo ===
        "bidireccional"
    ) {

        /*
         * Esta condición se mantiene únicamente
         * como protección mientras index.html
         * todavía conserva el antiguo campo.
         *
         * No utilizamos el concepto bidireccional
         * en el modelo.
         */

        campoPesoSimple.classList.remove(
            "oculto"
        );


        if (
            campoPesosBidi
        ) {

            campoPesosBidi.classList.add(
                "oculto"
            );
        }


        return;
    }


    // ----------------------------------
    // DIRIGIDA / NO DIRIGIDA
    // ----------------------------------

    campoPesoSimple.classList.remove(
        "oculto"
    );


    if (
        campoPesosBidi
    ) {

        campoPesosBidi.classList.add(
            "oculto"
        );
    }
}


// ==================================================
// GUARDAR EDICIÓN ARISTA
// ==================================================

function guardarEdicionArista() {

    if (
        !aristaEnEdicion
    ) {

        return;
    }


    // ----------------------------------
    // OBTENER TIPO
    // ----------------------------------

    const radioSeleccionado =
        document.querySelector(
            'input[name="tipo-arista"]:checked'
        );


    if (
        !radioSeleccionado
    ) {

        return;
    }


    const tipoSeleccionado =
        radioSeleccionado.value;


    // ----------------------------------
    // PROTEGER CONTRA BIDIRECCIONAL
    // ----------------------------------

    if (
        tipoSeleccionado ===
        "bidireccional"
    ) {

        /*
         * El modelo ya no admite
         * este tipo de arista.
         *
         * No hacemos ningún cambio.
         */

        return;
    }


    // ----------------------------------
    // CAMBIAR TIPO
    // ----------------------------------

    aristaEnEdicion.cambiarTipo(
        tipoSeleccionado
    );


    // ----------------------------------
    // CAMBIAR PESO
    // ----------------------------------

    aristaEnEdicion.cambiarPeso(
        inputPesoSimple.value
    );


    // ----------------------------------
    // CERRAR MODAL
    // ----------------------------------

    menuArista.classList.add(
        "oculto"
    );


    aristaEnEdicion =
        null;


    // ----------------------------------
    // REDIBUJAR
    // ----------------------------------

    renderizador.dibujarGrafo(
        grafo
    );
}


// ==================================================
// CANCELAR LONG PRESS
// ==================================================

function cancelarLongPress() {

    if (
        temporizadorLongPress
    ) {

        clearTimeout(
            temporizadorLongPress
        );


        temporizadorLongPress =
            null;
    }
}


// ==================================================
// LIMPIAR INTERACCIÓN
// ==================================================

function limpiarInteraccion() {

    if (
        punteroActivo !== null &&
        svg.hasPointerCapture(
            punteroActivo
        )
    ) {

        svg.releasePointerCapture(
            punteroActivo
        );
    }


    nodoInicial =
        null;


    posicionInicial =
        null;


    huboMovimiento =
        false;


    punteroActivo =
        null;
}


// ==================================================
// OBTENER POSICIÓN SVG
// ==================================================

function obtenerPosicionSVG(
    evento
) {

    const rect =
        svg.getBoundingClientRect();


    return {

        x:
            evento.clientX -
            rect.left,

        y:
            evento.clientY -
            rect.top
    };
}