const firefox = require('selenium-webdriver/firefox');
const {By} = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");
const fs = require('fs')
const {Key} = require("selenium-webdriver");
const options = new firefox.Options();
let readline = require('readline');
const {Builder} = require('selenium-webdriver');

options.setPreference('network.proxy.type', 1)
    .setPreference('network.proxy.socks', '127.0.0.1')
    .setPreference('network.proxy.socks_port', 9150)
    .setPreference('network.proxy.socks_remote_dns', true)
    .setPreference('network.proxy.socks_version', 5)

let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

let found = [];

async function getFoundTitles(n){
    await driver.findElements(By.tagName('h4')).then(async function (titles) {
        try{
            for (let key = 0; key < n; key++){
                if(await titles[key]){
                    let link = await titles[key].getText();
                    await found.push(link)
                    await console.log(link)
                }
                else {
                    return
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    })
}

async function main(driver){
    driver.get('http://msydqstlz2kzerdg.onion/')
    let readlineSync = require('readline-sync');
    let searchString = await readlineSync.question('Введите запрос:  ');
    let n = await readlineSync.question('Введите количество ссылок:  ');
    await driver.wait(webdriver.until.elementLocated(By.id('id_q')))
        .sendKeys(searchString);
    await driver.findElement(By.xpath('//input[@value=\'Search\']'))
        .click()
    driver.wait(webdriver.until.elementLocated(By.id('ahmiaResultsPage')))
        .then(async ()=>{
            await getFoundTitles(n);
        })
}

main(driver).then(r => { r});
