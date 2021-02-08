const { firefox } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs');

const boards = ['https://2ch.hk/au/', 'https://2ch.hk/bi/', 'https://2ch.hk/biz/', 'https://2ch.hk/bo/', 'https://2ch.hk/c/',
'https://2ch.hk/cc/', 'https://2ch.hk/cc/', 'https://2ch.hk/em/', 'https://2ch.hk/fa/', 'https://2ch.hk/fiz/',
'https://2ch.hk/fl/', 'https://2ch.hk/ftb/', 'https://2ch.hk/hi/', 'https://2ch.hk/me/', 'https://2ch.hk/mg/',
'https://2ch.hk/mlp/', 'https://2ch.hk/mo/', 'https://2ch.hk/mov/', 'https://2ch.hk/mu/', 'https://2ch.hk/ne/',
'https://2ch.hk/psy/', 'https://2ch.hk/re/', 'https://2ch.hk/sci/', 'https://2ch.hk/sf/', 'https://2ch.hk/sn/',
'https://2ch.hk/sp/', 'https://2ch.hk/spc/', 'https://2ch.hk/tv/', 'https://2ch.hk/un/', 'https://2ch.hk/w/',
'https://2ch.hk/wh/', 'https://2ch.hk/wm/', 'https://2ch.hk/wp/', 'https://2ch.hk/zog/', 'https://2ch.hk/de/',
'https://2ch.hk/di/', 'https://2ch.hk/diy/', 'https://2ch.hk/mus/', 'https://2ch.hk/pa/', 'https://2ch.hk/p/',
'https://2ch.hk/wrk/', 'https://2ch.hk/po/', 'https://2ch.hk/news/', 'https://2ch.hk/int/', 'https://2ch.hk/hry/',
'https://2ch.hk/gd/', 'https://2ch.hk/hw/', 'https://2ch.hk/mobi/', 'https://2ch.hk/pr/', 'https://2ch.hk/ra/',
'https://2ch.hk/s/', 'https://2ch.hk/t/', 'https://2ch.hk/bg/', 'https://2ch.hk/cg/', 'https://2ch.hk/ruvn/',
'https://2ch.hk/tes/', 'https://2ch.hk/v/', 'https://2ch.hk/vg/', 'https://2ch.hk/wr/', 'https://2ch.hk/a/',
'https://2ch.hk/fd/', 'https://2ch.hk/ja/', 'https://2ch.hk/ma/', 'https://2ch.hk/vn/', 'https://2ch.hk/d/',
'https://2ch.hk/b/', 'https://2ch.hk/soc/', 'https://2ch.hk/media/', 'https://2ch.hk/r/', 'https://2ch.hk/api/',
'https://2ch.hk/rf/', 'https://2ch.hk/o/', 'https://2ch.hk/fg/', 'https://2ch.hk/fur/', 'https://2ch.hk/gg/',
'https://2ch.hk/ga/', 'https://2ch.hk/hc/', 'https://2ch.hk/e/', 'https://2ch.hk/fet/', 'https://2ch.hk/sex/',
'https://2ch.hk/fag/'];

(async () => {
    const browser = await firefox.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    for(let board in boards){
        await page.goto(boards[board]);
        let links = [];
        const content = await page.content();
        let $ = cheerio.load(content);
        let name = $('header__boardname.boardname').text();
        $('.post__detailpart.desktop a').each((idx, elem) => {
            let link = $(elem);
            links.push('https://2ch.hk' + link.attr('href'));
        })
        fs.writeFileSync('2chLinks.txt', links)
        let images = [];
        let Threads = {};

        async function getThread() {
            const threadContent = await page.content();
            let $1 = cheerio.load(threadContent);
            let threadName = $1('.post__title').text();
            let opMessage = $1('.thread__oppost').text();
            let comments = [];
            $('.post.post_type_reply').each((idx, elem) => {
                let comment = $(elem).text();
                comments.push(comment);
            })
            $('.desktop').each((i, e) => {
                let link = $(e).attr('href');
                images.push(link);
            })
            Threads[threadName] = {
                opMessage: opMessage,
                comments: comments
            }
        }

        for (let key in links) {
            await page.goto(links[key]);
            await getThread();
        }

        Threads = JSON.stringify(Threads);
        fs.writeFileSync( board + '.txt', Threads)
        fs.writeFileSync( board + '_imgs.txt', images)
    }
    await page.close();
    await context.close();
    await browser.close();
})();
