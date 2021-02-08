const { firefox } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs');
(async () => {
    const browser = await firefox.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
        await page.goto('https://boards.4chan.org/s/');
        let links = [];
        const content = await page.content();
        let $ = cheerio.load(content);
        $('.replylink').each((idx, elem) => {
            let link = $(elem);
            links.push('https://boards.4chan.org/s/' + link.attr('href'));
        })
        fs.writeFileSync('4chLinks.txt', links)
        //let images = [];
        let Threads = {};
        async function getThread() {
            const threadContent = await page.content();
            let $1 = cheerio.load(threadContent);
            let opMessage = $1('.post op').text();
            let comments = [];
            $('post reply').each((idx, elem) => {
                let comment = $(elem).text();
                comments.push(comment);
            })
            // $('.desktop').each((i, e) => {
            //     let link = $(e).attr('href');
            //     images.push(link);
            // })
            Threads = {
                opMessage: opMessage,
                comments: comments
            }
        }
        for (let key in links) {
            await page.goto(links[key]);
            await getThread();
        }
        Threads = JSON.stringify(Threads);
        fs.writeFileSync( '4chan' + '.txt', Threads)
        // fs.writeFileSync( board + '_imgs.txt', images)
    await page.close();
    await context.close();
    await browser.close();
})();
