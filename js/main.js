console.log('super lista');


// ---------------------------------------
//          VARIABLES GLOBALES
// ---------------------------------------

let listaProductos = [/*

    {nombre: 'Pan', cantidad: 2, precio: 12.34},
    {nombre: 'Carne', cantidad: 3, precio: 34.56},
    {nombre: 'Leche', cantidad: 4, precio: 56.78},
    {nombre: 'Fideos', cantidad: 5, precio: 65.49}
*/
]



// ---------------------------------------
//          FUNCIONES
// ---------------------------------------


function guardarListaProductosLocal(lista){
    let prod = JSON.stringify(lista) 
    localStorage.setItem('LISTA', prod)
}

function leerListaProductosLocal(lista){

    if(localStorage.getItem('LISTA')){
        lista = JSON.parse(localStorage.getItem('LISTA'))
    }

    return lista;
}

function getURL(){
    return 'https://5ed19aa84e6d7200163a0a33.mockapi.io/lista/'
}

/* ------------------------------------- */
/*    API REST */
/* ------------------------------------- */
/* GET: nos permite traer todos los productos */
function getProdWeb(cb){
    
    let url = getURL() + '?' + Date.now()
    $.ajax({url, method: 'get'})
    .then(cb)
    .catch(error => {
        console.log(error)
        listaProductos = leerListaProductosLocal(listaProductos)
        cb(listaProductos)
    })
}


/* DELETE: nos permite borrar un producto por ID */
function deleteProdWeb(id,cb){
    
    let url = getURL() + id
    $.ajax({url, method: 'delete'})
    .then(cb)
    .catch(error => {
        console.log(error)
        cb('error')
    })
}


/* UPDATE: actualiza producto por ID - precio y cantidad */
function updateProdWeb(id, prod, cb){
    
    let url = getURL() + id
    $.ajax({url: url, data: prod, method: 'put'})
    .then(cb)
    .catch(error => {
        console.log(error)
        cb('error')
    })
}


/* POST: actualiza sin ID */
function postProdWeb(prod, cb){
    
    let url = getURL()
    $.ajax({url: url, data: prod, method: 'post'})
    .then(cb)
    .catch(error => {
        console.log(error)
        cb('error')
    })
}



/*
let crearLista = true;
// Se declara ul asi por un tema de Scope
let ul;

*/


function borrarProd(id){
    console.log(id);

    deleteProdWeb(id, prod =>{
    //listaProductos.splice(index, 1);
    renderLista();
    console.log('delete', prod)

    })

}

function cambiarCantidad(id, e){
    let cantidad = Number(e.value);
    let index = listaProductos.findIndex(prod => prod.id == id)

    console.log('cambiarCantidad', id, index, cantidad);

    listaProductos[index].cantidad = cantidad;
    let prod = listaProductos[index]

    /* Guardamos los prods en LocalStorage */
    guardarListaProductosLocal(listaProductos)

    updateProdWeb(id, prod, prod=>{
        console.log('update cantidad', prod)
    })
}

function cambiarPrecio(id, e){
    let precio = Number(e.value);
    let index = listaProductos.findIndex(prod => prod.id == id)

    console.log('cambiarPrecio', id, index, precio);
    listaProductos[index]['precio'] = precio;

    let prod = listaProductos[index]
    
    /* Guardamos los prods en LocalStorage */
    guardarListaProductosLocal(listaProductos)

    updateProdWeb(id, prod, prod=>{
        console.log('update update precio', prod)
    })

}

// Esto es para la botanera para agregar un prod nuevo y borrar todos
function configurarListeners(){

    document.getElementById('btn-entrada-producto').addEventListener('click', () =>{

        let producto = document.getElementById('ingreso-producto').value;
        if( producto != '' ){
            console.log(producto);
/*
            listaProductos.push({
                nombre : producto,
                cantidad: 1,
                precio: 0
            })
*/

            let prod = {
                nombre : producto,
                cantidad: 1,
                precio: 0
            }

            postProdWeb(prod, prod=>{
                console.log('post', prod);
                renderLista()
                document.getElementById('ingreso-producto').value  = '';
            })


            // Llamo a la funcion para que se ejecute cuando agrego un nuevo producto
            /*
            renderLista();
            document.getElementById('ingreso-producto').value  = '';
            */
        }
    })

    $('#btn-borrar-productos').click( () =>{
        console.log('borrar productos');

        //listaProductos = [];

        deleteAllProdWeb( info => {
            console.log(info)
            renderLista()
        })
    })
}


/* PONER SPINNER */
async function deleteAllProdWeb(cb){
    for(let i=0; i<listaProductos.length; i++){

        let porcentaje = parseInt( (i*100) / listaProductos.length )
        console.log(porcentaje + '%')

        try{
        let url = getURL() + listaProductos[i].id
        let p = await $.ajax({url, method: 'delete'})
        console.log('Producto borrado', p)
    }
    catch(error){
        let err = {
            info: 'error',
            error
        }
        cb(err)
        }
    }
    cb('ok')
}


function renderLista() {
// AJAX con jquery
/*
    $.get('plantilla-lista.hbs', source => {

        const template = Handlebars.compile(source)
        let data = {listaProductos }
        // igual a:{listaProductos : listaProductos} // clave : valor de un array
        let lista = document.getElementById('lista')
        lista.innerHTML = template(data)
    
    
            let ul = document.getElementById('contenedor-lista');
            // Para corregir el error de css que no se ve la animacion despues de borrar un elemeneto:
            componentHandler.upgradeElements(ul);

    })
*/

    $.ajax({url: 'plantilla-lista.hbs', method: 'get'})
    .then(source => {
        const template = Handlebars.compile(source)
        getProdWeb(prods => {
            listaProductos = prods
            /* Guardamos los productos en LocalStorage */
        guardarListaProductosLocal(listaProductos)
            
        let data = {listaProductos}

        let lista = document.getElementById('lista')
        lista.innerHTML = template(data)
    
    
        let ul = document.getElementById('contenedor-lista');
            // Para corregir el error de css que no se ve la animacion despues de borrar un elemeneto:
        componentHandler.upgradeElements(ul);
        })


    })
    .catch(error => console.log('Erros en renderLista: ', error))


/*
    let xhr = new XMLHttpRequest
    xhr.open('get', 'plantilla-lista.hbs')
    xhr.send()

    xhr.addEventListener('load', () =>{
        if( xhr.status == 200 ){
            let source = xhr.response

            const template = Handlebars.compile(source)
            let data = {listaProductos }
            // igual a:{listaProductos : listaProductos} // clave : valor de un array
            let lista = document.getElementById('lista')
            lista.innerHTML = template(data)
        
        
                let ul = document.getElementById('contenedor-lista');
                // Para corregir el error de css que no se ve la animacion despues de borrar un elemeneto:
                componentHandler.upgradeElements(ul);
        }
    })
*/
}



  

function registrarServiceWorker() {
    if('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            this.navigator.serviceWorker.register('./sw.js').then(function(reg) {
                console.log('El service worker se registró correctamente', reg)
            })
            .catch(function(err) {
                console.warn('Error al registrar el service worker', err)
            })
        })
    }
}
function start(){
registrarServiceWorker()
configurarListeners()
renderLista()
}


// ---------------------------------------
//          EJECUCION
// ---------------------------------------
//start();
//Esto es para que primero cargue todo lo del DOM y despues llamo las funciones, sin importar si esta en el footer o en el header
//window.onload = start;
window.addEventListener('DOMContentLoaded', start)