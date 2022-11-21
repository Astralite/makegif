<h1>Utility to compile a folder of images into a gif</h1>

<b>Install dependencies:</b>
```bash
npm install
```

<b>Install globally:</b> <i>(from the root of the project)</i>
```bash
npm install -g ./
```

<b>Basic usage:</b>
```
makegif [options] [output_filename (optional)]
```

<b>Options:</b>
```
-h, --help
    show help message and exit
-i INPUT, --input=INPUT
    Input folder
    default: ./input
-o OUTPUT, --output=OUTPUT
    Output folder
    default: ./output
-e X, --every=X
    Only use every Xth image (e.g. 2 would use every other image)
    Good for reducing file size
    default: 1
-s SPEED, --speed=SPEED
    Speed of gif (higher is faster)
    default: 4 (i.e. 100ms per frame)
```
![](example.gif)

Based on example code at https://github.com/benjaminadk/gif-encoder-2