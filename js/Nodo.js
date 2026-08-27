class Nodo {

    constructor(
        id,
        etiqueta,
        x,
        y
    ) {

        // ==================================
        // IDENTIDAD
        // ==================================

        // El ID identifica permanentemente
        // al nodo y no debe modificarse.

        this.id = id;

        // ==================================
        // INFORMACIÓN DEL NODO
        // ==================================

        // La etiqueta sí puede modificarse.

        this.etiqueta = etiqueta;

        // ==================================
        // POSICIÓN
        // ==================================

        this.x = x;
        this.y = y;


        // ==================================
        // APARIENCIA
        // ==================================

        this.radio = 30;
        this.color = "#4A90E2";
    }

    // ==================================
    // CAMBIAR POSICIÓN
    // ==================================

    cambiarPosicion(
        x,
        y
    ) {

        this.x = x;
        this.y = y;
    }


    // ==================================
    // CAMBIAR ETIQUETA
    // ==================================

    cambiarEtiqueta(
        nuevaEtiqueta
    ) {

        if (
            typeof nuevaEtiqueta !==
            "string"
        ) {

            return false;
        }

        nuevaEtiqueta =
            nuevaEtiqueta.trim();

        if (
            nuevaEtiqueta.length === 0
        ) {

            return false;
        }

        this.etiqueta =
            nuevaEtiqueta;

        return true;
    }


    // ==================================
    // CAMBIAR COLOR
    // ==================================

    cambiarColor(
        nuevoColor
    ) {

        if (
            typeof nuevoColor !==
            "string"
        ) {

            return false;
        }

        this.color =
            nuevoColor;

        return true;
    }

    // ==================================
    // CAMBIAR RADIO
    // ==================================

    cambiarRadio(
        nuevoRadio
    ) {
        nuevoRadio =
            Number(
                nuevoRadio
            );

        if (
            Number.isNaN(
                nuevoRadio
            )
        ) {

            return false;
        }

        if (
            nuevoRadio < 10 ||
            nuevoRadio > 100
        ) {

            return false;
        }

        this.radio =
            nuevoRadio;

        return true;
    }
}