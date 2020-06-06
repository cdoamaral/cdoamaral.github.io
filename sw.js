const  CACHE_STATIC_NAME = 'static-v4'
const  CACHE_INMUTABLE_NAME = 'inmutable-v4'
const  CACHE_DYNAMIC_NAME = 'dynamic-v4'

self.addEventListener('install', e => {
    console.log('SW install!!!')

    // Es para hacer el proceso de 'Update on reload' de manera automatica
    self.skipWaiting()
    //------------------------------------------------------//
    // Guardar recursos de la APP SHELL en el Cache
    //------------------------------------------------------//
    //const cacheStatic = caches.open('cache-1').then(cache =>{})
    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache =>{
        return cache.addAll([
            '/index.html',
            '/css/estilos.css',
            '/js/main.js',
            '/plantilla-lista.hbs',
            '/images/super.jpg'
        ])
    }) 
    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache =>{
        return cache.addAll([
            '/js/handlebars-v4.7.6.js',
            'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
            'https://code.getmdl.io/1.3.0/material.min.js',
            'https://code.jquery.com/jquery-3.5.1.min.js'
        ])

    })
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
})


// En Activate se borran los caches que no se usan
self.addEventListener('activate', e =>{
    console.log('SW activate****!')


    const cacheWhiteList = [
        CACHE_STATIC_NAME,
        CACHE_INMUTABLE_NAME,
        CACHE_DYNAMIC_NAME
    ]

    // waitUntil espera que terminen procesos asincronicos
    e.waitUntil(
        caches.keys().then(keys => {
            console.log(keys)
            return Promise.all(
                keys.map(cache => {
                console.log(cache)
                    if(!cacheWhiteList.includes(cache)){
                        return caches.delete(cache)
                    }
                })
            )
        })
    )


})

self.addEventListener('fetch', e =>{
    //console.log('SW fetch')
    //console.log(e)

    //console.log(e.request.url)
    //e.respondWith(fetch(e.request))

    
    //Aca esta todo el trafico. Aca tenemos que llenar el Cache Static. Aca primero buscamos el recurso en el Cache y si no esta lo buscamos
    if(e.request.method == 'GET' && !e.request.url.includes('mockapi.io')){
        const respuesta = caches.match(e.request).then( res => {
            if(res){
                console.log('Esta en cache', e.request.url)
                return res
            }
            console.log('No esta en cache',  e.request.url)
            return fetch(e.request).then(nuevaRespuesta =>{
                caches.open(CACHE_DYNAMIC_NAME).then(cache =>{
                    cache.put(e.request, nuevaRespuesta)
                })
                //No puede ser el mismo objeto que esta en la promesa, sino que lo clonamos. Porque puede que uno de los procesos modifique el objeto entonces no puede faltar en el otro objeto. Objetos independientes pero igual uno al otro
                return nuevaRespuesta.clone()
            })
        })
    
        e.respondWith(respuesta)
    } else {
        console.log('bypass', e.request.method, e.request.url)
    }
    
})
