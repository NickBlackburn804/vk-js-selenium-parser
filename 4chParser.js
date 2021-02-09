const { firefox } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs');
(async () => {
    const browser = await firefox.launch({
        headless: false
    });
    let images = [];
    let boards = [];
    const context = await browser.newContext();
    const page = await context.newPage();
    const content = await page.content();
    await page.goto('https://www.4chan.org/')
        let $2 = cheerio.load(content)
    await Promise.all([
    $2('.boardlink').each((idx, elem) => {
        let link = $2(elem);
        boards.push(link.attr('href'));
    })
])

    for(let board in boards){
        await page.goto(boards[board]);
        let links = [];
        const content = await page.content();
        let $ = cheerio.load(content);
        $('.replylink').each((idx, elem) => {
            let link = $(elem);
            links.push('https://boards.4chan.org/s/' + link.attr('href'));
        })
        fs.writeFileSync('4chLinks.txt', links)
        let Threads = {};

        async function getThread() {
            const threadContent = await page.content();
            let $1 = cheerio.load(threadContent);
            let opMessage = $1('.postMessage').text();
            let comments = [];
            $('.post reply').each((idx, elem) => {
                let comment = $(elem).text();
                comments.push(comment);
            })
            $('.fileText a').each((i, e) => {
                let link = $(e).attr('href');
                images.push('\n' + link.replace('//', ''));
            })
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
        fs.writeFileSync(board + '4chan' + '.txt', Threads)
        fs.writeFileSync(board + '_imgs4.txt', images)
    }



    await page.close();
    await context.close();
    await browser.close();
})();
