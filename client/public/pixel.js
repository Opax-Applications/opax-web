(function() {
    // initialize the global queue, 'q' which is attached to a 'opax' object
    if (!('opax' in window)) {
        window.opax = function() {
            window.opax.q.push(arguments);
        };
        window.opax.q = [];
    }

    // load your js library of pixel functions...
    var script = document.createElement('script');
    script.src = 'https://dev.monitor.opax.com.au/client/pixel-library.min.js';

    // ...do it asynchronously...
    script.async = true;

    // ...and insert it before the first script on the page!
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
})();