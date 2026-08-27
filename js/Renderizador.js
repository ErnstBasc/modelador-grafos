// ==================================================
// MODELADOR DE GRAFOS
// RENDERIZADOR
// ==================================================

class Renderizador {

    constructor(svg) {

        this.svg = svg;

        this.capaAristas =
            document.getElementById("capa-aristas");

        this.capaNodos =
            document.getElementById("capa-nodos");
    }


    // ==================================================
    // DIBUJAR GRAFO
    // ==================================================

    dibujarGrafo(grafo) {

        this.capaAristas.innerHTML = "";
        this.capaNodos.innerHTML = "";

        // ----------------------------------------------
        // ARISTAS
        // ----------------------------------------------

        const aristas =
            grafo.obtenerAristas();

        aristas.forEach(arista => {

            this.dibujarArista(
                arista,
                grafo
            );

        });


        // ----------------------------------------------
        // NODOS
        // ----------------------------------------------

        const nodos =
            grafo.obtenerNodos();

        nodos.forEach(nodo => {

            this.dibujarNodo(nodo);

        });
    }


    // ==================================================
    // NODO
    // ==================================================

    dibujarNodo(nodo) {

        const grupo =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );

        grupo.setAttribute(
            "data-tipo",
            "nodo"
        );

        grupo.setAttribute(
            "data-id",
            nodo.id
        );

        grupo.classList.add("nodo");


        // ----------------------------------------------
        // CÍRCULO
        // ----------------------------------------------

        const circulo =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );

        circulo.setAttribute(
            "cx",
            nodo.x
        );

        circulo.setAttribute(
            "cy",
            nodo.y
        );

        circulo.setAttribute(
            "r",
            nodo.radio
        );

        circulo.setAttribute(
            "fill",
            nodo.color
        );

        grupo.appendChild(
            circulo
        );


        // ----------------------------------------------
        // ETIQUETA
        // ----------------------------------------------

        const texto =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

        texto.setAttribute(
            "x",
            nodo.x
        );

        texto.setAttribute(
            "y",
            nodo.y
        );

        texto.setAttribute(
            "text-anchor",
            "middle"
        );

        texto.setAttribute(
            "dominant-baseline",
            "central"
        );

        texto.textContent =
            nodo.etiqueta;

        grupo.appendChild(
            texto
        );


        this.capaNodos.appendChild(
            grupo
        );
    }


    // ==================================================
    // ARISTA
    // ==================================================

    dibujarArista(
        arista,
        grafo
    ) {

        // --------------------------------------------------
        // BUCLE
        // --------------------------------------------------

        if (
            arista.esBucle()
        ) {

            this.dibujarBucle(
                arista
            );

            return;
        }


        // --------------------------------------------------
        // COMPROBAR ARISTA INVERSA
        // --------------------------------------------------

        const existeInversa =
            this.existeAristaInversa(
                arista,
                grafo
            );


        // --------------------------------------------------
        // DOS ARISTAS EN SENTIDOS OPUESTOS
        // --------------------------------------------------

        if (
            existeInversa
        ) {

            this.dibujarAristaCurva(
                arista
            );

            return;
        }


        // --------------------------------------------------
        // ARISTA NORMAL
        // --------------------------------------------------

        this.dibujarAristaRecta(
            arista
        );
    }


    // ==================================================
    // COMPROBAR ARISTA INVERSA
    // ==================================================

    existeAristaInversa(
        arista,
        grafo
    ) {

        return grafo.obtenerAristas().some(
            otraArista => {

                if (
                    otraArista.id ===
                    arista.id
                ) {

                    return false;
                }

                return (
                    otraArista.origen ===
                    arista.destino &&

                    otraArista.destino ===
                    arista.origen
                );
            }
        );
    }


    // ==================================================
    // ARISTA RECTA
    // ==================================================

    dibujarAristaRecta(
        arista
    ) {

        const grupo =
            this.crearGrupoArista(
                arista
            );


        // ----------------------------------------------
        // DATOS DE LOS NODOS
        // ----------------------------------------------

        const x1 =
            arista.origen.x;

        const y1 =
            arista.origen.y;

        const x2 =
            arista.destino.x;

        const y2 =
            arista.destino.y;


        const dx =
            x2 - x1;

        const dy =
            y2 - y1;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia === 0
        ) {

            return;
        }


        // ----------------------------------------------
        // VECTOR UNITARIO
        // ----------------------------------------------

        const ux =
            dx / distancia;

        const uy =
            dy / distancia;


        // ----------------------------------------------
        // EXTREMOS EN LOS BORDES
        // ----------------------------------------------

        const inicioX =
            x1 +
            ux *
            arista.origen.radio;

        const inicioY =
            y1 +
            uy *
            arista.origen.radio;


        const finX =
            x2 -
            ux *
            arista.destino.radio;

        const finY =
            y2 -
            uy *
            arista.destino.radio;


        // ----------------------------------------------
        // HITBOX
        // ----------------------------------------------

        const lineaHitbox =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );

        lineaHitbox.setAttribute(
            "x1",
            inicioX
        );

        lineaHitbox.setAttribute(
            "y1",
            inicioY
        );

        lineaHitbox.setAttribute(
            "x2",
            finX
        );

        lineaHitbox.setAttribute(
            "y2",
            finY
        );

        lineaHitbox.setAttribute(
            "stroke",
            "transparent"
        );

        lineaHitbox.setAttribute(
            "stroke-width",
            "20"
        );

        lineaHitbox.setAttribute(
            "pointer-events",
            "stroke"
        );

        grupo.appendChild(
            lineaHitbox
        );


        // ----------------------------------------------
        // LÍNEA VISIBLE
        // ----------------------------------------------

        const linea =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );

        linea.setAttribute(
            "x1",
            inicioX
        );

        linea.setAttribute(
            "y1",
            inicioY
        );

        linea.setAttribute(
            "x2",
            finX
        );

        linea.setAttribute(
            "y2",
            finY
        );

        linea.setAttribute(
            "stroke",
            "#333333"
        );

        linea.setAttribute(
            "stroke-width",
            "2"
        );


        // ----------------------------------------------
        // FLECHA
        // ----------------------------------------------

        if (
            arista.tipo ===
            "dirigida"
        ) {

            linea.setAttribute(
                "marker-end",
                "url(#flecha)"
            );
        }


        grupo.appendChild(
            linea
        );


        // ----------------------------------------------
        // PESO
        // ----------------------------------------------

        this.dibujarPesoSimple(
            grupo,
            arista
        );


        this.capaAristas.appendChild(
            grupo
        );
    }


    // ==================================================
    // ARISTA CURVA (CORREGIDA GEOMÉTRICAMENTE)
    // ==================================================

    dibujarAristaCurva(
        arista
    ) {

        const grupo =
            this.crearGrupoArista(
                arista
            );


        // ----------------------------------------------
        // DATOS DE LOS NODOS
        // ----------------------------------------------

        const x1 =
            arista.origen.x;

        const y1 =
            arista.origen.y;

        const x2 =
            arista.destino.x;

        const y2 =
            arista.destino.y;


        const dx =
            x2 - x1;

        const dy =
            y2 - y1;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia === 0
        ) {

            return;
        }


        // ----------------------------------------------
        // VECTOR UNITARIO Y NORMAL PERPENDICULAR
        // ----------------------------------------------

        const ux =
            dx / distancia;

        const uy =
            dy / distancia;

        const perpendicularX =
            -uy;

        const perpendicularY =
            ux;


        // ----------------------------------------------
        // SEPARACIÓN Y PUNTO DE CONTROL
        // ----------------------------------------------

        const separacion =
            Math.min(
                45,
                Math.max(
                    25,
                    distancia * 0.22
                )
            );

        const medioX =
            (x1 + x2) / 2;

        const medioY =
            (y1 + y2) / 2;

        const controlX =
            medioX +
            perpendicularX *
            separacion;

        const controlY =
            medioY +
            perpendicularY *
            separacion;


        // ----------------------------------------------
        // CORRECCIÓN DE TANGENTES Y CORTES EN BORDES
        // ----------------------------------------------

        // Tangente en origen (origen -> control)
        const tanOrigX =
            controlX - x1;

        const tanOrigY =
            controlY - y1;

        const distOrig =
            Math.sqrt(
                tanOrigX * tanOrigX +
                tanOrigY * tanOrigY
            );

        const dirInicioX =
            tanOrigX / distOrig;

        const dirInicioY =
            tanOrigY / distOrig;


        // Tangente en destino (control -> destino)
        const tanDestX =
            x2 - controlX;

        const tanDestY =
            y2 - controlY;

        const distDest =
            Math.sqrt(
                tanDestX * tanDestX +
                tanDestY * tanDestY
            );

        const dirFinX =
            tanDestX / distDest;

        const dirFinY =
            tanDestY / distDest;


        // Puntos exactos sobre el borde del circulo
        const inicioX =
            x1 +
            dirInicioX *
            arista.origen.radio;

        const inicioY =
            y1 +
            dirInicioY *
            arista.origen.radio;

        const finX =
            x2 -
            dirFinX *
            arista.destino.radio;

        const finY =
            y2 -
            dirFinY *
            arista.destino.radio;


        const dPath =
            `M ${inicioX} ${inicioY} Q ${controlX} ${controlY} ${finX} ${finY}`;


        // ----------------------------------------------
        // HITBOX CURVA
        // ----------------------------------------------

        const hitbox =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

        hitbox.setAttribute(
            "d",
            dPath
        );

        hitbox.setAttribute(
            "fill",
            "none"
        );

        hitbox.setAttribute(
            "stroke",
            "transparent"
        );

        hitbox.setAttribute(
            "stroke-width",
            "24"
        );

        hitbox.setAttribute(
            "pointer-events",
            "stroke"
        );

        grupo.appendChild(
            hitbox
        );


        // ----------------------------------------------
        // CURVA VISIBLE
        // ----------------------------------------------

        const curva =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

        curva.setAttribute(
            "d",
            dPath
        );

        curva.setAttribute(
            "fill",
            "none"
        );

        curva.setAttribute(
            "stroke",
            "#333333"
        );

        curva.setAttribute(
            "stroke-width",
            "2"
        );


        // ----------------------------------------------
        // FLECHA
        // ----------------------------------------------

        if (
            arista.tipo ===
            "dirigida"
        ) {

            curva.setAttribute(
                "marker-end",
                "url(#flecha)"
            );
        }


        grupo.appendChild(
            curva
        );


        // ----------------------------------------------
        // PESO
        // ----------------------------------------------

        this.dibujarPesoCurvo(
            grupo,
            arista,
            controlX,
            controlY,
            1
        );


        this.capaAristas.appendChild(
            grupo
        );
    }


    // ==================================================
    // CREAR GRUPO DE ARISTA
    // ==================================================

    crearGrupoArista(
        arista
    ) {

        const grupo =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );

        grupo.setAttribute(
            "data-tipo",
            "arista"
        );

        grupo.setAttribute(
            "data-id",
            arista.id
        );

        grupo.classList.add(
            "arista"
        );

        return grupo;
    }


    // ==================================================
    // PESO DE ARISTA RECTA
    // ==================================================

    dibujarPesoSimple(
        grupo,
        arista
    ) {

        if (
            arista.peso === null ||
            arista.peso === undefined ||
            arista.peso === ""
        ) {

            return;
        }


        const x =
            (
                arista.origen.x +
                arista.destino.x
            ) / 2;


        const y =
            (
                arista.origen.y +
                arista.destino.y
            ) / 2;


        const texto =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

        texto.setAttribute(
            "x",
            x
        );

        texto.setAttribute(
            "y",
            y - 8
        );

        texto.setAttribute(
            "text-anchor",
            "middle"
        );

        texto.classList.add(
            "peso-arista"
        );

        texto.textContent =
            arista.peso;

        grupo.appendChild(
            texto
        );
    }


    // ==================================================
    // PESO DE ARISTA CURVA
    // ==================================================

    dibujarPesoCurvo(
        grupo,
        arista,
        controlX,
        controlY,
        lado
    ) {

        if (
            arista.peso === null ||
            arista.peso === undefined ||
            arista.peso === ""
        ) {

            return;
        }


        const desplazamiento =
            8 * lado;


        const texto =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

        texto.setAttribute(
            "x",
            controlX
        );

        texto.setAttribute(
            "y",
            controlY +
            desplazamiento
        );

        texto.setAttribute(
            "text-anchor",
            "middle"
        );

        texto.classList.add(
            "peso-arista"
        );

        texto.textContent =
            arista.peso;

        grupo.appendChild(
            texto
        );
    }


    // ==================================================
    // BUCLE
    // ==================================================

    dibujarBucle(
        arista
    ) {

        const grupo =
            this.crearGrupoArista(
                arista
            );


        const nodo =
            arista.origen;


        const radio =
            nodo.radio;


        const radioBucle =
            radio * 0.9;


        const centroX =
            nodo.x;


        const centroY =
            nodo.y -
            radio;


        // ----------------------------------------------
        // CAMINO
        // ----------------------------------------------

        const camino =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );


        const x =
            centroX;

        const y =
            centroY;


        camino.setAttribute(
            "d",
            `M ${x - radioBucle} ${y}
             C ${x - radioBucle}
               ${y - radioBucle * 1.8},
               ${x + radioBucle}
               ${y - radioBucle * 1.8},
               ${x + radioBucle}
               ${y}`
        );


        camino.setAttribute(
            "fill",
            "none"
        );


        camino.setAttribute(
            "stroke",
            "#333333"
        );


        camino.setAttribute(
            "stroke-width",
            "2"
        );


        // ----------------------------------------------
        // FLECHA
        // ----------------------------------------------

        if (
            arista.tipo ===
            "dirigida"
        ) {

            camino.setAttribute(
                "marker-end",
                "url(#flecha)"
            );
        }


        grupo.appendChild(
            camino
        );


        // ----------------------------------------------
        // PESO
        // ----------------------------------------------

        if (
            arista.peso !== null &&
            arista.peso !== undefined &&
            arista.peso !== ""
        ) {

            const texto =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );

            texto.setAttribute(
                "x",
                nodo.x
            );

            texto.setAttribute(
                "y",
                nodo.y -
                radio *
                2.8
            );

            texto.setAttribute(
                "text-anchor",
                "middle"
            );

            texto.classList.add(
                "peso-arista"
            );

            texto.textContent =
                arista.peso;

            grupo.appendChild(
                texto
            );
        }


        this.capaAristas.appendChild(
            grupo
        );
    }
}   
