const { firefox } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs');
(async () => {
    const browser = await firefox.launch({
        headless: false,
        firefoxUserPrefs: {'network.proxy.type': 1,
            'network.proxy.socks': '127.0.0.1',
            'network.proxy.socks_port': 9150,
            'network.proxy.socks_remote_dns': true,
            'network.proxy.socks_version': 5}
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://flibustahezeous3.onion/');
    await page.fill('input[name="name"]', '');
    await page.fill('input[name="pass"]', '');
    await page.click('input[name="op"]');

    await Promise.all([
        page.waitForNavigation(/*{ url: 'http://flibustahezeous3.onion/node' }*/),
        await page.click('text="Популярные книги"')
    ]);

    const content = await page.content();
    let $ = cheerio.load(content);
    const books = [];
    let curPage = 1;
    $('li').each((idx, elem) => {
        const title = $(elem).text();
        books.push(title + '\n');
    })
    for(let i = 1; i <= 5; ++i){
        await page.goto('http://flibustahezeous3.onion/stat/b?page=' + i);
        $('li').each((idx, elem) => {
            const title = $(elem).text();
            books.push(title + '\n');
        })
    }



    fs.writeFileSync('popularBooks.txt', books)

    await page.close();
    await context.close();
    await browser.close();
})();
