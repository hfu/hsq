#! /usr/bin/env node
const fs = require('fs')
const readline = require('readline')
const v2q = v => {
  for(let i = 0; true; i++) {
    if(v / (2 ** i) < 1) return i - 1
  }
}
const ZBOUND = 19
const QBOUND = 25
let r = new Array(QBOUND)
for(let q = 0; q < QBOUND; q++) {
  r[q] = new Array(ZBOUND).fill(0)
}
const show = () => {
  console.log('qz ' + 
    new Array(ZBOUND).fill(0).map((v, i) => {
      return ('  ' + i).substr(-2)
    }).join(' '))
  for(let k in r) {
    const q = k - 1
    console.log(('  ' + (k - 1)).substr(-2) + ' ' +
      r[k].map(v => {return (('  ' + v2q(v))).substr(-2)}).join(' '))
  }
}

if (process.argv.length == 2) {
  console.log('usage: node mbq.js {headless serialtiles}')
  process.exit()
}
let count = 0
for (let i = 2; i < process.argv.length; i++) {
  let path = process.argv[i]
  if (!fs.existsSync(path)) throw `${path} not found.`
  readline.createInterface({
    input: fs.createReadStream(path, 'utf-8')
  }).on('line', data => {
    const row = JSON.parse(data)
    if (!row.buffer) return
    const buf = Buffer.from(row.buffer, 'base64')
    const q = v2q(buf.length)
    r[q + 1][row.z] += 1 
    count++
    if (count % 50000 === 0) {
      console.log(`${path}: ${count}`)
      show()
    }
  }).on('close', () => {
    console.log(`final result for ${count} tiles`)
    show()
  })
}
