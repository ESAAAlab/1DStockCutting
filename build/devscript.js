// Adds LiveReload script pointing at the client's hostname. 
// This is helpful for mobile web development where your desktop might point at localhost while 
// your devices point to a local IP address.
var head = document.getElementsByTagName('head').item(0);

var livereloadscript = document.createElement('script');
livereloadscript.setAttribute('src','http://' + window.location.hostname + ':35729/livereload.js?snipver=1');
livereloadscript.setAttribute('type','text/javascript');

head.appendChild(livereloadscript);

// Adds the client as a weinre(web inspector remote) debugging target at http://localhost:8082/client/#anonymous 
// This is used to debug every mobile browser besides Mobile Safari and Chrome for Android 
/*var weinrescript = document.createElement('script');
weinrescript.setAttribute('src','http://' + window.location.hostname + ':8082/target/target-script-min.js#anonymous');
weinrescript.setAttribute('type','text/javascript');

head.appendChild(weinrescript);*/