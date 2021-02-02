const firefox = require('selenium-webdriver/firefox');
const {By} = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");
const fs = require('fs')
const {Key} = require("selenium-webdriver");
const options = new firefox.Options();
options.setBinary("/geckodriver");
let parsedPosts = [];
let notsList = [];
const {Builder} = require('selenium-webdriver');
let driver = new Builder().forBrowser('firefox').build();

function sleep(ms)
{
    return new Promise((resolve, reject) => {
        setTimeout(function (){
            resolve();
        }, ms)
    })
}


async function getNotifications(){
    await driver.findElements(By.className('feedback_content')).then(async function (notifications) {
        try{
            for (let key in notifications) {
                 notsList.push(await notifications[key].getText())
                 console.log( await notifications[key])
                  parsedPosts.push(notsList)
            }
        }
        catch (e) {
            console.log(e)
        }
    })
}


async function notificationsParser(driver) {
    driver.get("https://vk.com/");
    await driver.findElement(By.id('index_email'))
        .sendKeys('');
    await driver.findElement(By.id('index_pass'))
        .sendKeys('')
    await driver.findElement(By.id('index_login_button'))
        .click()
    let not_btn = driver.wait(webdriver.until.elementLocated(By.id('top_notify_btn')));
    await not_btn.click();
    await not_btn.click();
    await driver.wait(webdriver.until.elementLocated(By.className('feed_row _feed_row')))
        .then(async ()=>{
            await getNotifications();
        })
    console.log(notsList)
    fs.writeFileSync('notifications', JSON.stringify(parsedPosts));
    await driver.quit();
}
notificationsParser(driver).then(r => { r});
