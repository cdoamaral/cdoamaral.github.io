console.log('super lista');


// ---------------------------------------
//          VARIABLES GLOBALES
// ---------------------------------------

let listaProductos = [

    {nombre: 'Pan', cantidad: 2, precio: 12.34},
    {nombre: 'Carne', cantidad: 3, precio: 34.56},
    {nombre: 'Leche', cantidad: 4, precio: 56.78},
    {nombre: 'Fideos', cantidad: 5, precio: 65.49}

]

let crearLista = true;
// Se declara ul asi por un tema de Scope
let ul;


// ---------------------------------------
//          FUNCIONES
// ---------------------------------------
function borrarProd(index){
    console.log(index);
    listaProductos.splice(index, 1);
    renderLista();
}

function cambiarCantidad(index, e){
    let cantidad = Number(e.value);
    console.log('cambiarCantidad', index, cantidad);
    listaProductos[index].cantidad = cantidad;
}

function cambiarPrecio(index, e){
    let precio = Number(e.value);
    console.log('cambiarPrecio', index, precio);
    listaProductos[index].precio = precio;

}

// Esto es para la botanera para agregar un prod nuevo y borrar todos
function configurarListeners(){
    document.getElementById('btn-entrada-producto').addEventListener('click', () =>{
        let producto = document.getElementById('ingreso-producto').value;
        if( producto != '' ){
            console.log(producto);

            listaProductos.push({
                nombre : producto,
                cantidad: 1,
                precio: 0
            })
            // Llamo a la funcion para que se ejecute cuando agrego un nuevo producto
            renderLista();
            document.getElementById('ingreso-producto').value  = '';
        }
    })

    document.getElementById('btn-borrar-productos').addEventListener('click', ()=>{
        console.log('borrar productos');

        listaProductos = [];
        renderLista();
    })
}


function renderLista() {

    if(crearLista){
        ul = document.createElement('ul');
        ul.classList.add('demo-list-icon', 'mdl-list', 'w-100');
    }


    ul.innerHTML = '';

   // listaProductos.forEach( function(prod, index){
    listaProductos.forEach( (prod,index) => {
        ul.innerHTML += `
        <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content w-10">
                <i class="material-icons">shopping_cart</i>
            </span>

            <span class="mdl-list__item-primary-content w-30">
                ${prod.nombre}
        </span>

            <span class="mdl-list__item-primary-content w-20">
                <div class="mdl-textfield mdl-js-textfield">
                    <input onchange="cambiarCantidad(${index}, this)"
                    class="mdl-textfield__input" type="text" id="sample-cantidad-${index}">
                        <label class="mdl-textfield__label" for="sample-cantidad-${index}">${prod.cantidad}</label>
            </div>
        </span>

                <span class="mdl-list__item-primary-content w-20 ml-item">
                    <div class="mdl-textfield mdl-js-textfield">
                        <input onchange="cambiarPrecio(${index}, this)"
                        class="mdl-textfield__input" type="text" id="sample-precio-${index}">
                            <label class="mdl-textfield__label" for="sample-precio-${index}">${prod.precio}</label>
            </div>
        </span>

                    <span class="mdl-list__item-primary-content w-20 ml-item">
                        <!-- Colored FAB button with ripple -->
            <button onclick="borrarProd(${index})"
                            class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
                            <i class="material-icons">remove_shopping_cart</i>
                        </button>
                    </span>
    </li>
    `

    })
    
    if(crearLista){
        document.getElementById('lista').appendChild(ul);
    } else {
    // Para corregir el error de css que no se ve la animacion despues de borrar un elemeneto:
    componentHandler.upgradeElements(ul);
     }



    crearLista = false;
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
window.onload = start;