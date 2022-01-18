"use strict";

document.querySelector(".closeButton").addEventListener("click", function() {
    document.querySelector(".wrapper").classList.toggle("close");
    document.querySelector(".closeButton").classList.toggle("rotate");
})
class MyPromise {
    _resolveHandlers = []
    _resolveResults = new Map()

    _PromiseState = "pending"
    _PromiseResult = undefined
    
    constructor(callback) {
        if (typeof callback !== "function") {
            return;
        }
        this.callback = callback;
        this.callback(this.resolve);
    }
    then = (resolveHandler) => {
        if (typeof resolveHandler === "function") { this._resolveHandlers.push(resolveHandler) };
        let promise = new MyPromise();

        this._resolveResults.set(resolveHandler, promise);
        return promise
    }
    resolve = (result) => {
        this._PromiseState = "fulfilled";
        this._PromiseResult = result;

        setTimeout(() => {      
            for (let resolveHandler of this._resolveHandlers) {
                let handlerResult = resolveHandler(this._PromiseResult);                
                let promise = this._resolveResults.get(resolveHandler);

                if (handlerResult instanceof MyPromise) {
                    handlerResult.then(
                        result => promise.resolve(result)
                    );
                    return;
                }

                promise._PromiseState = "fulfilled";
                promise._PromiseResult = handlerResult;
                promise.resolve(handlerResult);
            }
        }, 0);   
    }
}

// function loadScript(src) {
//     return new MyPromise(function(resolve) {
//         let script = document.createElement("script");
//         script.src = src;
//         script.onload = () => { resolve(script) };
//         // script.onerror = () => { reject(new Error(`Script load error for ${src}`)) };
        
//         document.head.append(script);
//     })
// }
// let promise = loadScript("animation.js")
//     .then(
//         script => {
//             return loadScript("slider.js");
//         }
//     )
//     .then(
//         script => {
//             return loadScript("gallery.js")    
//         }
//     );
