const { firefox } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs');
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 500;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function replaceAll(str, match, replacement){
    return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
}
(async () => {
    const browser = await firefox.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://pikabu.ru/');
    let postName = '';
    let postText = '';
    const comments = [];
    let posts = {};
    const content = await page.content();
    let $ = cheerio.load(content);
    let postsLinks = [];
    let num = 15;
    for(let i = 0; i < num; i++){
        await page.keyboard.press("KeyD")
    }
    $('.story__title-link').each(async (idx, elem) => {
        let post = $(elem)
        postsLinks.push(post.attr('href'))
    })
console.log(postsLinks)
    for (let post of postsLinks){
        try{
            await page.goto(post)
            await page.waitForTimeout(3000)
            postName = $('.story__title').text()
            postText = $('.story__main').text()
            $('p').each((idx, elem) => {
                const comment = $(elem).text();
                comments.push(comment);
            })
            posts[postName] = {
                text: postText,
                comments: comments
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    fs.writeFileSync('posts.json', JSON.stringify(posts))
    await page.close();
    await context.close();
    await browser.close();
})();

