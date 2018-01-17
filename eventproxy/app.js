const eventproxy = require('eventproxy'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    url = require('url')
const targetUrl = 'https://nba.hupu.com/stats/players/pts'

superagent.get(targetUrl)
    .end((err, res) => {
        if (err) {
            return console.log(err)
        }
        let urls =  []
        let $ = cheerio.load(res.text)
        $('.players_table .left a').each((index, element) => {
            let href = $(element).attr('href')
            urls.push(href)
        })
        console.log(urls)
    })