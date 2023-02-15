window.addEventListener("load", init);
const key = "07880df945ae318d79416922e15e7c11"
const temas = new Map();

function init() {
    document.getElementById("btnBuscar").addEventListener("click", buscar);
    document.getElementById("buscarTemas").addEventListener("input", autocompletar);
    getTemas();
    console.log(temas);

}

//Los temas estan en un map, que tiene en cada posicion el nombre y el id de cada tema.
function getTemas() {
    let listaTemas = [];
    fetch("https://rebrickable.com/api/v3/lego/themes/?page_size=460&key=" + key, { method: 'get' })
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (jsonData) {
            let results = jsonData.results;
            for (let i = 0; i < results.length; i++) {
                temas.set(results[i].name, results[i].id);
            }
        })
        .catch(function (ex) {
            console.error('Error', ex.message)
        })
}

function buscar() {
    let busqueda = document.querySelector("#buscarSets").value;
    let anio = document.querySelector("#buscarAño").value;
    let piezas = document.querySelector("#buscarPiezas").value;
    console.log(piezas);
    let tema = document.querySelector("#buscarTemas").value ? temas.get(document.querySelector("#buscarTemas").value) : "";

    fetch("https://rebrickable.com/api/v3/lego/sets/?search=" + busqueda + "&page_size=99999&theme_id=" + tema + "&min_year=" + anio + "&max_year=" + anio + "&min_parts=" + piezas + "&max_parts=" + piezas + "&key=" + key, { method: 'get' })
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (jsonData) {
            console.log(jsonData)
            for (let i = 0; i < jsonData.results.length; i++) {
                setJson = jsonData.results[i];
                console.log("Nombre del set: " + setJson.name);
                console.log("Año de salida del set: " + setJson.year);
                console.log("Imagen del set: " + setJson.set_img_url);
            }
        })
        .catch(function (ex) {
            console.error('Error', ex.message)
        })
}

function autocompletar(e) {
    cierraSugerencias();

    let valor = this.value;
    if (!valor)
        return false;

    /*Creamos un div que contendrá las sugerencias:*/
    let lista = document.createElement("datalist");
    lista.setAttribute("id", "lista-autocompleccion");
    this.setAttribute("list", "lista-autocompleccion")

    this.parentNode.appendChild(lista);
    temas.forEach((value, key) => {
        /* Crea un option para cada pais que comienza igual que el texto que he introducido */
        if (key.toLowerCase().startsWith(valor.toLowerCase())) {
            let sugerencia = document.createElement("option");
            sugerencia.id = value;
            sugerencia.value = key;
            lista.appendChild(sugerencia);
        }
    });
}

function cierraSugerencias() {
    var lista = document.querySelector("#lista-autocompleccion");
    if (lista)
        lista.parentNode.removeChild(lista);

}



