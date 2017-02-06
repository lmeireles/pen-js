# pen-js

PenJs is a basic, lightweight js drawing board that is easy to customize
and improve, hope you enjoy :)'

## Installation

You can download de source code from github, or use npm to download the package.
npm:<br>
<code>npm install pen-js --save</code>

After importing PenJs you just have to initialize the plugin:

<code>var pen = new PenJs('#my-container-id');</code>

###Public Methods

I will be adding functionalities to this as the library evolve, for now we have this :)
<br>
<code>.toDataURL(outputType)</code>
<b>outputType</b> optional, can be 'jpg' or 'png', default is 'png'.
Will return a base64 representation of the drawing.
<br>
<code>.redraw()</code>
Will repaint the canvas.
<br>
<code>.clear()</code>
Will clear the canvas.
