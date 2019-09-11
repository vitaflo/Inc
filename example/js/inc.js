/***********************************************************************
*  INC.JS
*  v2 
*
*  Client side JS includes.  Requires a webserver.
*
*  To run a web server locally on Mac at http://localhost:8000
*  Terminal to folder and use command:
*  python -m SimpleHTTPServer
*
*  Usage:
*  <!-- inc:/path/to/template.html -->
*
*  2019 - Brent Gustafson 
***********************************************************************/

document.addEventListener("DOMContentLoaded", ()=> {
    // Dev Environment true = keep inc: comments after insertion.
    const devEnv = false;

    // Safely grab scripts, move them to end of doc and run them.
    const runScripts = (text)=> {
        let tempDoc = document.implementation.createHTMLDocument();
        tempDoc.body.innerHTML = text;
        [].map.call(tempDoc.getElementsByTagName("script"), (el)=> {
            let scr = document.createElement("script");
            // Get and set attributes on script tags
            Array.from(el.attributes).forEach((att)=> {
                scr.setAttribute(att.nodeName, att.nodeValue);
            });
            scr.text = el.textContent;
            document.body.appendChild(scr);
        });
    }

    // Grab comment nodes from the document
    const nodeIterator = document.createNodeIterator(
        document,
        NodeFilter.SHOW_COMMENT,    
        (node)=> { return NodeFilter.FILTER_ACCEPT; }
    );

    // Iterate through all comment nodes
    while(nodeIterator.nextNode()){
        let commentNode = nodeIterator.referenceNode;

        // Is it actually a comment?
        if (commentNode.nodeType === 8) {
            // Parse out what file to include
            let match = /inc:(\S+)/.exec(commentNode.nodeValue || "");
            
            // Only include "inc:" comments
            if (match) {
                fetch(encodeURI(match[1])).then((data)=> {
                    return data.text().then((text)=> {
                        // Strip any script tags from include
                        let cleanText = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

                        // Make sure we've output includes before we run scripts
                        let insertHTML = new Promise((resolve, reject)=> {
                            // If the comment has a sibling, put include there
                            if (commentNode.nextElementSibling) {
                                resolve(commentNode.nextElementSibling.insertAdjacentHTML("beforebegin", cleanText));
                            }
                            // if not, put it at before the end of the parent
                            else {
                                resolve(commentNode.parentElement.insertAdjacentHTML("beforeend",  cleanText));
                            }
                        });
                        
                        // Remove comment and run scripts only after we've inserted the include
                        insertHTML.then(()=> {
                            if (!devEnv) {
                                commentNode.parentNode.removeChild(commentNode);
                            }
                            runScripts(text);
                        });
                    });
                });
            }
        }
    }
});


