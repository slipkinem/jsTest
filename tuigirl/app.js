const path = require('path')
const fs = require('fs')
const superagent = require('superagent')
const cheerio = require('cheerio')
const EventEmitter = require('events')

const URL = 'http://www.nanrenxp.com/gg'
const log = console.log
const imgRoot = path.resolve(process.cwd(), 'imgs')
let queue = []

class CloneEmitter extends EventEmitter {
}

const event = new CloneEmitter()

event.on('loadItemEnd', () => {
  if (queue.length) {
  } else {
  }
})

if (!fs.existsSync(imgRoot)) {
  fs.mkdirSync(imgRoot)
}

async function downLoad(URL) {
  return new Promise((resolve, reject) => {
    superagent
      .get(URL)
      .end((err, res) => {
        if (err) log(err)
        let text = Object.create(null)
        try {
          text = cheerio.load(res.text)
        } catch (e) {
          log(e, URL)
        }
        resolve(text)
      })
  })
}

async function install(url) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .end((err, res) => {
        if (err) {
          console.error(err)
        }
        resolve(res)
      })
  })
}

async function getImages(URL) {
  const $ = await downLoad(URL)
  let promises = []
  let urls = []

  $('ul#post_container>li>div>a').each((index, a) => {
    let url = $(a).attr('href')
    log(url)
    urls.push(url)
    promises.push(downLoad(url))
  })

  Promise.all(promises)
    .then(contents => {
      handleContents(contents, urls)
    })

}


function handleContents(contents, urls) {

  contents.forEach(($, index) => {
    log('---------------------------------------------------------', index)
    let title = $('title').text()
    let total = $('.pagelist ul>li').length - 3
    log(total)

    for (let i = 1; i <= total; i++) {
      downLoad(`${urls[index]}/${i}`)
        .then($ => {
          let srcs = []
          $('#post_content').find('p>a>img').each((index, img) => {
            let src = ''
            try {
              src = $(img).attr('src')
              handleSrcs(src, title, i + '' + index)
            } catch (e) {
              console.error(e)
            }
          })

          return srcs
        })
    }

  })

}

function handleSrcs(src, title, name) {
  log('src', src)
  install(src)
    .then(image => {
      let imgPath = path.resolve(imgRoot, title)

      if (!fs.existsSync(imgPath)) {
        fs.mkdirSync(imgPath)
      }

      log('开始存储照片')

      log('image', image)
      fs.writeFileSync(path.resolve(imgPath, `${name}.jpg`), image.body, null)

      log('存储照片结束')

    })
}

try {
  getImages(URL)
} catch (e) {
  console.error(e)
}
