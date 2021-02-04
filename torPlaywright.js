const { firefox } = require('playwright');

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
    await page.goto('http://msydqstlz2kzerdg.onion/');
    await page.fill('input[name="q"]', 'money');
    await page.click('input[type="submit"]');

    let links = await page.evaluate(() => {
        let hrefs = [];
        const titles = document.querySelectorAll("h4");
        for (let i = 0; i < titles.length; ++i) {
            hrefs.push(titles[i]);
            console.log(titles[i])
        }
        return Promise.resolve(hrefs);
    });
    console.log(links)
    await page.close();
    await context.close();
    await browser.close();
})();
