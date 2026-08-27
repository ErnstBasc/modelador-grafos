class Grafo {

    constructor() {

        // ==================================
        // COLECCIONES
        // ==================================

        this.nodos = [];

        this.aristas = [];


        // ==================================
        // CONTADORES DE ID
        // ==================================

        this.contadorNodos = 0;

        this.contadorAristas = 0;
    }


    // ==================================
    // NODOS
    // ==================================

    crearNodo(
        x,
        y
    ) {

        const etiqueta =
            this.generarEtiqueta();


        const id =
            `N${++this.contadorNodos}`;


        const nodo =
            new Nodo(
                id,
                etiqueta,
                x,
                y
            );


        this.nodos.push(
            nodo
        );


        return nodo;
    }


    // ==================================
    // GENERAR ETIQUETA AUTOMÁTICA
    // ==================================

    generarEtiqueta() {

        let numero =
            this.nodos.length;

        let etiqueta;


        do {

            etiqueta =
                convertirNumeroALetras(
                    numero
                );

            numero++;

        } while (
            this.existeEtiqueta(
                etiqueta
            )
        );


        return etiqueta;
    }


    // ==================================
    // COMPROBAR ETIQUETA
    // ==================================

    existeEtiqueta(
        etiqueta
    ) {

        return this.nodos.some(
            nodo =>
                nodo.etiqueta ===
                etiqueta
        );
    }


    // ==================================
    // OBTENER NODOS
    // ==================================

    obtenerNodos() {

        return this.nodos;
    }


    // ==================================
    // OBTENER NODO POR ID
    // ==================================

    obtenerNodoPorId(
        id
    ) {

        return this.nodos.find(
            nodo =>
                nodo.id === id
        );
    }


    // ==================================
    // ELIMINAR NODO
    // ==================================

    eliminarNodo(
        id
    ) {

        const nodo =
            this.obtenerNodoPorId(
                id
            );


        if (!nodo) {

            return false;
        }


        // ----------------------------------
        // ELIMINAR ARISTAS CONECTADAS
        // ----------------------------------

        this.aristas =
            this.aristas.filter(
                arista => {

                    return (
                        arista.origen !== nodo &&
                        arista.destino !== nodo
                    );

                }
            );


        // ----------------------------------
        // ELIMINAR NODO
        // ----------------------------------

        this.nodos =
            this.nodos.filter(
                nodoActual =>
                    nodoActual.id !== id
            );


        return true;
    }


    // ==================================
    // ARISTAS
    // ==================================

    crearArista(
        origen,
        destino
    ) {

        // ----------------------------------
        // COMPROBAR NODOS
        // ----------------------------------

        if (
            !origen ||
            !destino
        ) {

            return null;
        }


        // ----------------------------------
        // EVITAR ARISTAS DUPLICADAS
        // ----------------------------------

        if (
            this.existeArista(
                origen,
                destino
            )
        ) {

            return null;
        }


        // ----------------------------------
        // CREAR ID
        // ----------------------------------

        const id =
            `E${++this.contadorAristas}`;


        // ----------------------------------
        // CREAR ARISTA
        // ----------------------------------

        const arista =
            new Arista(
                id,
                origen,
                destino
            );


        this.aristas.push(
            arista
        );


        return arista;
    }


    // ==================================
    // COMPROBAR EXISTENCIA DE ARISTA
    // ==================================

    existeArista(
        origen,
        destino
    ) {

        return this.aristas.some(
            arista => {

                // ----------------------------------
                // MISMO SENTIDO
                // ----------------------------------

                const mismaDireccion =
                    arista.origen === origen &&
                    arista.destino === destino;


                // ----------------------------------
                // ARISTA NO DIRIGIDA
                // ----------------------------------

                const aristaNoDirigida =
                    arista.tipo ===
                    "no_dirigida";


                // ----------------------------------
                // DIRECCIÓN INVERSA
                // ----------------------------------

                const direccionInversa =
                    arista.origen === destino &&
                    arista.destino === origen;


                // ----------------------------------
                // REGLAS
                // ----------------------------------

                // Si ya existe A → B,
                // no podemos crear otra A → B.

                if (
                    mismaDireccion
                ) {

                    return true;
                }


                // Si existe A — B no podemos
                // crear B → A ni A → B.

                if (
                    aristaNoDirigida &&
                    direccionInversa
                ) {

                    return true;
                }


                // Si existe B → A y queremos
                // crear A → B, sí está permitido.

                return false;
            }
        );
    }


    // ==================================
    // OBTENER ARISTAS
    // ==================================

    obtenerAristas() {

        return this.aristas;
    }


    // ==================================
    // OBTENER ARISTA POR ID
    // ==================================

    obtenerAristaPorId(
        id
    ) {

        return this.aristas.find(
            arista =>
                arista.id === id
        );
    }


    // ==================================
    // ELIMINAR ARISTA
    // ==================================

    eliminarArista(
        id
    ) {

        const cantidadInicial =
            this.aristas.length;


        this.aristas =
            this.aristas.filter(
                arista =>
                    arista.id !== id
            );


        return (
            this.aristas.length <
            cantidadInicial
        );
    }


    // ==================================
    // CANTIDAD DE NODOS
    // ==================================

    cantidadNodos() {

        return this.nodos.length;
    }


    // ==================================
    // CANTIDAD DE ARISTAS
    // ==================================

    cantidadAristas() {

        return this.aristas.length;
    }
}


// ==========================================
// CONVERTIR NÚMERO A LETRAS
// ==========================================

function convertirNumeroALetras(
    numero
) {

    let resultado = "";


    while (
        numero >= 0
    ) {

        resultado =
            String.fromCharCode(
                65 + (numero % 26)
            ) +
            resultado;


        numero =
            Math.floor(
                numero / 26
            ) - 1;
    }


    return resultado;
}