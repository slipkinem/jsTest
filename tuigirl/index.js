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
        resolve(cheerio.load(res.text))
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
    let contentUrls = []
    let title = $('title').text()
    let total = $('.pagelist ul>li').length - 3
    log(total)

    for (let i = 1; i <= total; i++) {
      contentUrls.push(`${urls[index]}/${i}`)
    }

    Promise.all(contentUrls.map(contentUrl => {
      return downLoad(contentUrl)
        .then($ => {
          let srcs = []
          $('#post_content').find('p>a>img').each((index, img) => {
            let src = ''
            try {
              src = $(img).attr('src')
              srcs.push(src)
            } catch (e) {
              console.error(e)
            }
          })

          return srcs
        })
    }))
      .then(srcs => {
        let result = []
        log(srcs)
        srcs.forEach(src => {
          if (Array.isArray(src)) {
            src.forEach(s => {
              result.push(s)
            })
          } else {
            result.push(src)
          }
        })
        handleSrcs(result, title)
      })

  })

}

function handleSrcs(srcs, title) {
  Promise.all(srcs.map(src => {
    console.log('src', src)
    return install(src)
  }))
    .then(images => {
      let imgPath = path.resolve(imgRoot, title)
      fs.mkdirSync(path.resolve(imgPath))

      log('开始存储照片')

      images.forEach((image, index) => {
        log('image', image)
        fs.writeFileSync(path.resolve(imgPath, `${index + 1}.jpg`), image.body, null)
      })

      log('存储照片结束')

    })
}

try {
  getImages(URL)
} catch (e) {
  console.error(e)
}
