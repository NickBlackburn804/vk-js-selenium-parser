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

function sleep(ms)
{
    return new Promise((resolve, reject) => {
        setTimeout(function (){
            resolve();
        }, ms)
    })
}
async function getGroups(){
    const communities = driver.wait(webdriver.until.elementLocated(By.xpath('//span[contains(.,\'Сообщества\')]')), 10000)
    communities.click()
    communities.click()

    let isComs = driver.wait(webdriver.until.elementLocated(By.id('groups_list_search')));
    await isComs.then(async ()=>{
        try{
            driver.executeScript('window.scrollTo(0, document.body.scrollHeight);')
        }
        catch (e) {
            console.log(e)
        }
    })
    await driver.findElements(By.className('group_row_title')).then(async function (groups) {
        try{
            for (let key in groups) {
                groupsList.push(await groups[key].getText())
            }
        }
        catch (e) {
            console.log(e)
        }
    })
    return groupsList;
}
async function getTextContent(cnt){
    let post = {}
    let post_link = driver.wait(webdriver.until.elementLocated(By.className('post_link')), 10000)
        post_link.click()
    await driver.wait(webdriver.until.elementLocated(By.id('wl_post_body_wrap')))
        .then(async ()=>{
            await webdriver.Key.ARROW_LEFT
            for (let i = 0; i < cnt; i++) {
                post.author = await driver.findElement(By.className('author')).getText();
                post.post_date = await driver.findElement(By.className('post_date')).getText();
                post.textContent = await driver.findElement(By.id('wl_post_body_wrap')).getText();
                post.comments = await driver.findElement(By.className('wl_replies')).getText();
                parsedPosts.push(post);
            }
            if (cnt > 1) {
                await driver.findElement(By.id('wk_right_arrow'))
                    .click();
            }
        })
    for (let i = 0; i <= cnt; i++) {
        await driver.executeScript("window.history.go(-1)");
    }
}
async function parser(driver) {
    driver.get("https://vk.com/");
    await driver.findElement(By.id('index_email'))
        .sendKeys('');
    await driver.findElement(By.id('index_pass'))
        .sendKeys('')
    await driver.findElement(By.id('index_login_button'))
        .click()
    let groups = [];
    groups = await getGroups();
    for (let key in groups) {
        let gKey = driver.wait(webdriver.until.elementLocated(By.linkText(groups[key])));
            gKey.click()
        await getTextContent(1)
    }
    fs.writeFileSync('posts.txt', JSON.stringify(parsedPosts));
    console.log('SUCCESS')
    await driver.quit();
}
parser(driver).then(r => { r});
