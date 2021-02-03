const { firefox } = require('playwright');
(async () => {
    const browser = await firefox.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://vk.com/');
    await page.click('form[id="index_login_form"] input[name="email"]');
    await page.fill('form[id="index_login_form"] input[name="email"]', '+');
    await page.click('form[id="index_login_form"] input[name="pass"]');
    await page.fill('form[id="index_login_form"] input[name="pass"]', '');
    await page.press('form[id="index_login_form"] input[name="pass"]', 'Enter');

    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://vk.com/groups' }*/),
        page.click('//a[normalize-space(.)=\'Сообщества 0\']')
    ]);

   async function getTextContent(){
       let groups = await page.evaluate(async() => {
           let postContent = document.querySelector(".post_link");
           return Promise.resolve(postContent);
       });
       console.log(groups)
        return groups;
   }

    let groups = await page.evaluate(() => {
        let hrefs = [];
        const lnks = document.querySelectorAll('.group_row_title');
        for (let i = 0; i < lnks.length; ++i) {
            hrefs.push(lnks[i].href);
        }
        return Promise.resolve(hrefs);
    });
    let postContent;
    let n = 1;


    for(let i = 0; i<n; i++){
        for (let key in groups) {
            await page.goto(groups[key])
            await Promise.all([
                page.waitForNavigation(/*{ url: 'groups[key]' }*/),
                await page.click('.post_link'),
                postContent = document.querySelector(".wall_post_text"),
                console.log(postContent)
            ]);
        }
    }
    await page.close();
    await context.close();
    await browser.close();
})();
