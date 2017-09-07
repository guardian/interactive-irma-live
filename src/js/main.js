var el = document.createElement('script');

el.src = process.env.PATH + '/app.js';
document.body.appendChild(el);

function inIframe () {
    if(window.frameElement) {
    	return true;
    } else {
    	return false;
    }
}

if(inIframe()) {
    var html = document.querySelector("html");
    var body = document.querySelector("body");

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    html.style.padding = 0;
    body.style.padding = 0;

    html.style.margin = 0;
    body.style.margin = 0;
}