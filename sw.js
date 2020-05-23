self.addEventListener('install', e => {
    console.log('SW install')
})

self.addEventListener('activate', e =>{
    console.log('SW activate')
})

self.addEventListener('fetch', e =>{
    //console.log('SW fetch')
    //console.log(e)
    let url = e.request.url;
    let method = e.request.method;

    //Detecta si un recurso esta en la recorrida de los archivos que carga la pagina. Devuelve true o false
    console.log(url.includes('estilos.css'))
    console.log(url, method);
    console.log(e.request);
    console.log('--------------');

    // Genera una respuesta por parte del SW
/*
    respondWit trabaja con Promesas
    En la pestaña Network del nav: 
    sin el icono de engranaje es la parte de la app con el SW
    con el engranaje es la parte de SW con internet
*/

    // let respuesta = fetch(url);
    // let respuesta
    let respuesta = fetch(e.request.url);

    // Para que un recurso no se cargue:
    if( url.includes('estilos.css') ){
        // respuesta = null;
        respuesta = new Response(`
            body{
                background-color: lightblue;
            }

            .w-100{
                width: 100%;
            }
            
            
            .w-10{
                width: 10%;
            }
            
            .w-20{
                width: 20%;
            }
            
            .w-30{
                width: 30%;
            }
            
            .w-40{
                width: 40%;
            }
            
            .ml-item{
                margin-left: 20px;
            }
            
            .contenedor{
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
            
            .page-content{
                padding: 10px;
            }
            
            img{
                width: 100%;
                max-width: 800px;
                border-radius: 20px;
                margin-bottom: 20px;
            }
            `, {
                headers: {
                    'content-type' : 'text/css'
                }
            })
    } else if( url.includes('material.indigo-pink.min.css') ){
        
        respuesta = fetch('https://code.getmdl.io/1.3.0/material.lime-yellow.min.css')

    } else if( url.includes('super.jpg') ) {
        
        //respuesta = fetch('images/super2.jpg');
        
        respuesta = fetch('https://cached.imagescaler.hbpl.co.uk/resize/scaleWidth/1068/cached.offlinehbpl.hbpl.co.uk/news/OMC/ThinkstockPhotos-672450320_edited-1-201805010914584451-20200331093556905.jpg', {mode: 'no-cors'})
        .catch(error => console.log('Error en fetch imagen', error))


    } else if( url.includes('main.js') ) {
       
        //Esto seria un recurso para 'hackear' o interferir en nuestros archivos. Tomando el js de otra fuente
        respuesta = fetch('http://cdoamaral.000webhostapp.com/main.js', { mode: 'no-cors'});
    }
    else {
        //respuesta = fetch(url);
        e.respondWith(respuesta);
    }

    // e.respondWith(respuesta);

})