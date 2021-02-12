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
    // await Promise.all([
    //     page.waitForNavigation(/*{ url: 'https://www.tiktok.com' }*/),
    //     page.click('.login-button'),
    //     page.click('text')
    // ]);

    // login-button

    let profileData = {};
    let allProfilesData = [];
   async function getProfile(url){
       await page.goto(url)
       // await page.waitForSelector('.share-info')
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
            await page.keyboard.press("ArrowRight")
            const content = await page.content();
            let $ = cheerio.load(content);
            let postInfo = $('.video-infos-container').text()
            console.log(postInfo)
        }
    }


    for (let profile of Profiles){
        if(profile !== undefined){
            await getProfile('https://www.tiktok.com/@' + profile);
            await page.screenshot({path: 'tiktok_screenshots/' +  profile + '_scr.png'})
            await getPosts(4)

        }
    }





    await page.close();
    await context.close();
    await browser.close();
})();

