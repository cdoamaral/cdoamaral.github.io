/*
self.addEventListener('install', e => {
    console.log('SW install')
})

self.addEventListener('activate', e =>{
    console.log('SW activate')
})

self.addEventListener('fetch', e =>{
    console.log('SW fetch')
    console.log(e)
    console.log(e.request)
})
*/

self.addEventListener('install', e => {
    console.log('sw install')
})

self.addEventListener('activate', e => {
    console.log('sw activate')
})

self.addEventListener('fetch', e => {
    console.log('sw fetch')

    console.log(e.request.url)
})