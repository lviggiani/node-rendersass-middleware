# node-rendersass-middleware
Render scss in memory and delivers it. It also monitors all redered scss files for changes and recompile them automatically if required


## Usage ##

```javascript

import express from "express";
import rendersassMiddleware from "node-rendersass-middleware";

...

const app = express();

...

app.use(rendersassMiddleware()); // assumes your web pages are loading css from /css path 
                                 // and your scss sources are in scss folder

```


### custom paths ###

```javascript
app.use(rendersassMiddleware("style", path.join(process.cwd(), "myScssFolder"));
```

