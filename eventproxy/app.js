const eventproxy = require('eventproxy'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    url = require('url')
const targetUrl = 'https://cnodejs.org/'

superagent.get(targetUrl)
    .end((err, res) => {
        if (err) {
            return console.log(err)
        }
        let urls =  []
        let $ = cheerio.load(res.text)
        console.log($('#topic_list .topic_title'))
        $('#topic_list .topic_title').each((index, element) => {
            let href = url.resolve(targetUrl, $(element).attr('href'))
            urls.push(href)
        })
        console.log(urls)
    })