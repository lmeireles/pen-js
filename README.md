# pen-js

PenJs is a basic, lightweight js drawing board that is easy to customize
and improve, hope you enjoy :)'

## Installation

You can download de source code from github, or use npm to download the package.
npm:<br>
<code>npm install pen-js --save</code>

After importing PenJs you just have to initialize the plugin:

<code>var pen = new PenJs('#my-container-id');</code>

<hr>
###Public Methods

I will be adding functionalities to this as the library evolve, for now we have this :)
<br><br>
<code>.toDataURL(outputType)</code><br>
<b>outputType</b> optional, can be 'jpg' or 'png', default is 'png'.<br>
Will return a base64 representation of the drawing.
<br><br>
<code>.redraw()</code><br>
Will repaint the canvas.
<br><br>
<code>.clear()</code><br>
Will clear the canvas.
