# Inc.js
Inc.js is a simple way to include one HTML document into another one using nothing more than HTML comment tags.  Inc.js uses vanilla Javascript and as such has no dependencies.

I wrote Inc.js because I spent a lot of time mocking up static HTML templates and wanted an easy way to include reusable HTML snippets that didn't muddy up the HTML/DOM and was easy to use.  Using comments fit the bill.

### How to use
* Simply add a comment to your HTML with the format `<!-- inc:/path/to/template.html -->`
* The file to include can be any text file and include `style` tags, `HTML` tags and even `script` tags.
* Script tags will be stripped from the included file and placed at the end of the document and then run.

### Config
* In Inc.js (non-minified) you can set the `devEnv` (Dev Environment) to `true` or `false`.
* `true`     keeps the Inc comments in the DOM.
* `false` removes the Inc comments from the DOM (default).
* The minified JS does not have this feature and always removes Inc comments.
* Non-Inc comments will always stay in the DOM and not be removed.

### Requirements
* Inc.js needs a webserver to run correctly (because of AJAX calls).  If you’re developing locally and are on a Mac, you can easily get a webserver running.  Open the Terminal,  go to your project folder and use the command: `python -m SimpleHTTPServer`
* This will start a webserver for your project at `http://localhost:8000`

### Limitations
* Inc.js cannot do nested includes.  If you include a file that also has an include in it, it will simply spit out the resulting comment into the DOM, not the file it points to.
* While you can include a file with a `script` tag containing a `src` attribute (like jQuery), immediately using that source script may not work.  Instead, include your JS `src` includes in your main (non-included) HTML document.