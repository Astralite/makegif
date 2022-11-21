const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { promisify } = require('util')
const { createCanvas, Image } = require('canvas')
const { createWriteStream, readdir } = require('fs')
const GIFEncoder = require('gif-encoder-2')
const path = require('path')

const argv = yargs(hideBin(process.argv)).argv

const readdirAsync = promisify(readdir)

const hiddenFilesRegex = /^\./

async function createGif(algorithm, inputFolder, outputFolder, renderEvery, renderSpeed, outFileName) {
  return new Promise(async (resolve1) => {
    let files = await readdirAsync(inputFolder)

    // Only render every nth image
    files = files.filter((file, i) => i % renderEvery === 0 && !file.match(hiddenFilesRegex))

    const [width, height] = await new Promise((resolve2) => {
      const image = new Image()
      image.onload = () => resolve2([image.width, image.height])
      image.src = path.join(inputFolder, files[0])
    })

    const dstPath = path.join(outputFolder, outFileName)

    const writeStream = createWriteStream(dstPath)

    writeStream.on('close', () => {
      resolve1()
    })

    const encoder = new GIFEncoder(width, height, algorithm)

    encoder.createReadStream().pipe(writeStream)
    encoder.start()
    encoder.setDelay(400 / renderSpeed)


    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    for (const file of files) {
      await new Promise((resolve3) => {
        const image = new Image()
        image.onload = () => {
          ctx.drawImage(image, 0, 0)
          encoder.addFrame(ctx)
          resolve3()
        }
        image.src = path.join(inputFolder, file)
      })
    }
  })
}

if (argv.help || argv.h) {
  console.log('Usage: node makegif.js [options] [output_filename (optional)]')
  console.log('Options:')
  console.log('  -i, --inputFolder <path>  Path to folder containing images to render')
  console.log('  -o, --outputFolder <path> Path to folder to save output gif')
  console.log('  -e, --every <number>      Only render every nth image')
  console.log('  -s, --speed <number>      Render speed (higher is faster)')
  console.log('  -h, --help                Show this help')
  process.exit(0)
}

const defaultInputFolder = path.join(__dirname, 'input')
const defaultOutputFolder = path.join(__dirname, 'output')

const inputFolder = argv.inputFolder || argv.i || defaultInputFolder
const outputFolder = argv.outputFolder || argv.o || defaultOutputFolder
const renderEvery = argv.every || argv.e || 1
const renderSpeed = argv.speed || argv.s || 4
const outFileName = argv._[argv._.length - 1] || 'output.gif'

createGif('neuquant', inputFolder, outputFolder, renderEvery, renderSpeed, outFileName)