const firefox = require('selenium-webdriver/firefox');
const {By} = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");
const fs = require('fs')
const {Key} = require("selenium-webdriver");
const options = new firefox.Options();
options.setBinary("/geckodriver");
let parsedPosts = [];
let groupsList = [];
const {Builder} = require('selenium-webdriver');
let driver = new Builder().forBrowser('firefox').build();


const cookies = fs.readFileSync('cookies.json', 'utf8')
const deserializedCookies = JSON.parse(cookies);

async function main(driver) {
    let Profiles = [];
    await Promise.all([
        fs.readFile("Profiles", "utf8", function(error,data){
            for(let string in data)
                Profiles.push(data.split('\n')[string])
        })
    ]);
    /*Входим, добавляем куки, заходим снова. Иначе возникает ошибка*/
    driver.get("https://tiktok.com/");
    for(let cookie in deserializedCookies){
        await driver.manage().addCookie(deserializedCookies[cookie]);
    }
    driver.get("https://tiktok.com/");
    let ProfilesInfo = [];
    let Posts = [];

    /*Проход по профилям и постам. Потом вынесу в функцию.*/
    for (let profile of Profiles){
        if(profile !== undefined){
            driver.get('https://www.tiktok.com/@' + profile)
            ProfilesInfo.push(driver.wait(webdriver.until.elementLocated(By.css('.share-header'))));
            await driver.wait(webdriver.until.elementLocated(By.xpath('//div[@id=\'main\']/div[2]/div[2]/div/main/div[2]/div/div/div/div/div/a/span/div/div/div')))
                .click()
            for(let key = 0; key <= 5; key++){
                let show_more = driver.findElement(By.css('.view-more')).isDisplayed();
                if(show_more){
                    await driver.findElements(By.className('.view-more')).then(async function (groups) {
                        try{
                            for (let key in groups) {
                                groups[key].click();
                            }
                        }
                        catch (e) {
                            console.log(e)
                        }
                    })
                }

                await driver.wait(webdriver.until.elementLocated(By.css('.arrow-right')))
                    .click()
                await driver.wait(webdriver.until.elementLocated(By.css('.comment-item')))
                let postInfo = await driver.findElement(By.css('.video-infos-container')).getText();
                Posts.push(postInfo)
                console.log(postInfo)
            }
        }
    }

console.log(ProfilesInfo)

    await driver.quit();
}

main(driver).then(r => { r});
