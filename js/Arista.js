class Arista {

    constructor(
        id,
        origen,
        destino
    ) {

        // ==================================
        // IDENTIDAD
        // ==================================

        // El ID identifica permanentemente
        // a la arista y no debe modificarse.

        this.id = id;


        // ==================================
        // EXTREMOS
        // ==================================

        this.origen = origen;

        this.destino = destino;


        // ==================================
        // TIPO
        // ==================================

        // Valores posibles:
        //
        // "no_dirigida"
        // "dirigida"

        // Toda arista nueva será dirigida
        // por defecto.

        this.tipo =
            "dirigida";


        // ==================================
        // PESO
        // ==================================

        // Una arista tiene un único peso.
        //
        // En una arista dirigida:
        //
        // origen → destino
        //
        // Si existe otra arista:
        //
        // destino → origen
        //
        // esa segunda arista tendrá su
        // propio objeto Arista y su propio peso.

        this.peso = null;
    }


    // ==================================
    // DETERMINAR SI ES BUCLE
    // ==================================

    esBucle() {

        return (
            this.origen ===
            this.destino
        );
    }


    // ==================================
    // CAMBIAR TIPO
    // ==================================

    cambiarTipo(
        nuevoTipo
    ) {

        const tiposValidos = [

            "no_dirigida",

            "dirigida"

        ];

        if (
            !tiposValidos.includes(
                nuevoTipo
            )
        ) {

            return false;
        }

        this.tipo =
            nuevoTipo;

        return true;
    }


    // ==================================
    // CAMBIAR PESO
    // ==================================

    cambiarPeso(
        nuevoPeso
    ) {

        // ----------------------------------
        // PESO VACÍO
        // ----------------------------------

        if (
            nuevoPeso === null ||
            nuevoPeso === undefined ||
            nuevoPeso === ""
        ) {

            this.peso = null;

            return true;
        }


        // ----------------------------------
        // CONVERTIR A NÚMERO
        // ----------------------------------

        nuevoPeso =
            Number(
                nuevoPeso
            );


        // ----------------------------------
        // VALIDAR
        // ----------------------------------

        if (
            Number.isNaN(
                nuevoPeso
            )
        ) {

            return false;
        }


        // ----------------------------------
        // GUARDAR
        // ----------------------------------

        this.peso =
            nuevoPeso;

        return true;
    }


    // ==================================
    // OBTENER PESO
    // ==================================

    obtenerPeso(
        origen,
        destino
    ) {

        // ----------------------------------
        // COMPROBAR DIRECCIÓN
        // ----------------------------------

        if (
            origen === this.origen &&
            destino === this.destino
        ) {

            return this.peso;
        }


        // ----------------------------------
        // ARISTA NO DIRIGIDA
        // ----------------------------------

        if (
            this.tipo === "no_dirigida" &&
            origen === this.destino &&
            destino === this.origen
        ) {

            return this.peso;
        }


        // ----------------------------------
        // DIRECCIÓN NO VÁLIDA
        // ----------------------------------

        return null;
    }
}