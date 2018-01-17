const eventproxy = require('eventproxy'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    targetUrl = 'https://nba.hupu.com/stats/players/pts'

superagent.get(targetUrl)
    .end((err, res) => {
        if (err) {
            return console.log(err)
        }
        let urls = []
        let $ = cheerio.load(res.text)
        $('.players_table .left a').each((index, element) => {
            urls.push($(element).attr('href'))
        })
        // console.log(urls)

        let ep = new eventproxy()
        ep.after('render', urls.length, playerList => {
            playerList = playerList.map(player => {
                let $ = cheerio.load(player)
                return {
                    name: $('.bread-crumbs b').text().trim(),
                    score: $('.table_team_box .list .border').eq(1).find('.b b').text().trim(),
                    money: $('.content_a .font p').eq(8).text().split('：')[1]
                }
            })
            //排序
            playerList.sort((a, b) => Number(b.score) - Number(a.score))
            console.log(playerList)
        })

        urls.forEach(url => {
            superagent.get(url)
                .end((err, res) => {
                    if (err) {
                        console.log(err)
                    }
                    ep.emit('render', res.text)
                })
        })
    })