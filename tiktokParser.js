const { firefox } = require('playwright');
const cheerio = require('cheerio');
const fs = require("fs");

(async () => {
    const browser = await firefox.launch({
        headless: false
    });
    let Profiles = [];
    await Promise.all([
        fs.readFile("Profiles", "utf8", function(error,data){
            for(let string in data)
                    Profiles.push(data.split('\n')[string])
        })
    ]);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://vk.com/');
    await page.click('form[id="index_login_form"] input[name="email"]');
    await page.fill('form[id="index_login_form"] input[name="email"]', '');
    await page.press('form[id="index_login_form"] input[name="email"]', 'Tab');
    await page.fill('form[id="index_login_form"] input[name="pass"]', '');
    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://vk.com/feed' }*/),
        page.press('form[id="index_login_form"] input[name="pass"]', 'Enter')
    ]);
    await page.goto('https://www.tiktok.com/');
    // await page.click('.login-button')
    // const [page1] = await Promise.all([
    //     page.waitForEvent('popup'),https://www.tiktok.com/@_agentgirl_/video/6929102557151350017
    //     page.frame({
    //         url: 'https://www.tiktok.com/login/?enter_method=click_top_bar&redirect_url=https%3A%2F%2Fwww.tiktok.com%2F&enter_from=homepage_hot&is_modal=1&hide_close_btn=1'
    //     }).click('text="Log in with VK"')
    // ]);
    //
    // // Close page
    // await page1.close();
    // await Promise.all([
    //     page.waitForNavigation(/*{ url: 'https://www.tiktok.com' }*/),
    //     page.click('.login-button'),
    //     page.click('text')
    // ]);
    let profileData = {};
    let allProfilesData = [];
   async function getProfile(url){
       await page.goto(url)
       const content = await page.content();
       let $ = cheerio.load(content);
       profileData.profileName = $('.share-info').text().replace('Follow', '');
       profileData.countInfos = $('.count-infos').text().replace('Following', ' Following ').replace('Followers',' Followers ').replace('Likes', ' Likes');
       profileData.description = $('.share-desc').text().replace('\n', ' ');
       allProfilesData.push(profileData)
       console.log(profileData)
    }
    let posts = [];
    async function getPosts(n){
        await page.click('.like-icon');
        for(let i = 0; i <n; i++){
            const content1 = await page.content();
            let $2 = cheerio.load(content1);
            $2('.view-more padding').each(async (idx, elem) => {
                await page.click($(elem))
            })
            await page.keyboard.press("ArrowRight")
            const content = await page.content();
            let $ = cheerio.load(content);
            let postInfo = $('.video-infos-container').text()
            posts.push(postInfo + '\n')
        }
    }
//view-more padding

    for (let profile of Profiles){
        if(profile !== undefined){
            await getProfile('https://www.tiktok.com/@' + profile);
            await page.screenshot({path: 'tiktok_screenshots/' +  profile + '_scr.png'})
            await getPosts(15)

        }
    }

    fs.writeFileSync('tiktok_posts.txt', posts)



    await page.close();
    await context.close();
    await browser.close();
})();

