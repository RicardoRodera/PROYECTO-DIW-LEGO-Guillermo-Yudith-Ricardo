window.addEventListener("load", init);
const key = "07880df945ae318d79416922e15e7c11"
const temas = new Map();
const colores = ["rojo", "azul", "verde", "amarillo"];
let color=0;

var tamPagina=16;
var paginaActual=1;
var totalFiguras = 0;

function init() {
    //document.getElementById("btnBuscar").addEventListener("click", buscar);
    //document.getElementById("tema").addEventListener("input", autocompletar);
    //getTemas();
    //console.log(temas);
    mostrarApi();
    this.document.querySelector("#anterior").addEventListener("click",pulsaAnterior);
    this.document.querySelector("#siguiente").addEventListener("click",pulsaSiguiente);


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
                temas.set(results[i].id, results[i].name);
            }
        })
        .catch(function (ex) {
            console.error('Error', ex.message)
        })
}

function buscar() {
    //let busqueda = document.querySelector("#busqueda").value;
    //let anio = document.querySelector("#anio").value;
    //let piezas = document.querySelector("#piezas").value;
    //let tema = document.querySelector("#tema").value;

    fetch("https://rebrickable.com/api/v3/lego/sets/?search=" + busqueda + "&page_size=99999&theme_id=" + tema + "&min_year=" + anio + "&max_year=" + anio + "&key=" + key, { method: 'get' })
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
    console.log(temas);
    temas.forEach((value, key) => {
        /* Crea un option para cada pais que comienza igual que el texto que he introducido */
        if (tema.value.toLowerCase().startsWith(valor.toLowerCase())) {
            let sugerencia = document.createElement("option");
            sugerencia.id = key;
            sugerencia.value = value;
            lista.appendChild(sugerencia);
        }
    });
}

function cierraSugerencias() {
    var lista = document.querySelector("#lista-autocompleccion");
    if (lista)
        lista.parentNode.removeChild(lista);

}

function mostrarApi(){
   
    fetch(`https://rebrickable.com/api/v3/lego/sets/?&page_size=99999&key=${key}&limit=16&offset=${(paginaActual-1)*tamPagina}`)
        .then(response => response.json())
        .then(data => {
          totalFiguras = data.count;
          
        data.results.slice((paginaActual-1)*tamPagina, paginaActual*tamPagina).forEach(sets => {
         
          let tarjeta = `
            <div class="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center pb-5 pt-5">
              <div class="card ${colores[color]} border border-light rounded" style="width: 18em;">
                <div class="bg-light contenedorImagen">
                  ${comprobarImagen(sets.set_img_url)}
                </div>
                <div class="card-body mt-3 ">
                  <h5 class="card-title text-light">${sets.name}</h5>
                </div>
              </div>
            </div>`;
  
          document.getElementById('catalogo').innerHTML += tarjeta;
  
          color++;
          if(color==4){
            color=0
          };
          
          actualizaPaginacion(data);
      });
      
     
    }).catch(function (ex) {
      console.error('Error', ex.message)
    })
    color=0;
}

function actualizaPaginacion(){
  
    if(paginaActual==1){
      document.querySelector("#anterior").classList.add("disabled");
    }else if(paginaActual==Math.ceil(totalFiguras/tamPagina)){
        document.querySelector("#siguiente").classList.add("disabled");
    }else{
        document.querySelector("#anterior").classList.remove("disabled");
        document.querySelector("#siguiente").classList.remove("disabled");
    }
}

function comprobarImagen(valor){
    if(valor!=null){
      return  `<img src="`+valor+`" class="card-img-top">`;
    }else{
      return  `<img src="../Imagenes/LegoVacio.png" class="card-img-top">`;
    }
}

function cargaResultados(){
    document.getElementById("catalogo").innerHTML = "";
    mostrarApi();
}

function pulsaAnterior(){
    paginaActual--;
    cargaResultados();
   
}
   
function pulsaSiguiente(){
    paginaActual++;
    cargaResultados();
}


