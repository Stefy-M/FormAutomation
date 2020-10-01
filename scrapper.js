const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {

    const url = 'http://www.wildbeegrove.com/birth-chart-calculator---free.html';

    const browser = await puppeteer.launch({ headless: true, slowMo: 250 });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });

    //Start scrapping

    let AMPM = 'PM'
    for (var i = 1; i <= 24; i++) {

        console.clear()
        var hour = i
        console.log(i)
        

        //Set conditionals for i because it is used as a value for selecting hour
        //Case 1. i > 12 
        //Case 2. i mod 12 = 0 

        //Switch select to AM once i is greater that 12 and mod i by 12
        if(hour > 12){
            hour = hour % 12
            AMPM = 'AM'
        }

        //if i = 24 set i to 12 and AMPM to AM
        if (hour > 12 && hour == 24) {
            hour = 12
            AMPM = 'AM'
        }


        //Filling in form 
        await page.waitForSelector('form')
        await page.$eval('input[name=INPUT1]', el => el.value = 'Stefon Martin')
        await page.select('select[name=MONTH]', '09')
        await page.select('select[name=DAY]', '05')
        await page.select('select[name=YEAR]', '1995')

        //This is where the data need to change, every hour gives a different set of houses for birthchart
        await page.select('select[name=HOUR', hour.toString())
        await page.select('select[name=AMPM]', AMPM)

        await page.$eval('input[name=TOWN]', el => el.value = 'Seattle')
        await page.select('select[name=STATE]', 'WA')
        await page.click('input[name=Submit]')

        
        await page.waitFor(500)
        const pages = await browser.pages();
        const aHandle = await pages[pages.length-1].$('body')

        let pageResults = await aHandle.$eval(('div > p'), node => node.innerText)
        pageResults = pageResults + '\n----------------------------------\n'
        
        fs.appendFile('BirthChart.txt', pageResults, (err)=>{
            if(err) throw err
            console.log('Appending Data...')
        })




    }

    console.clear()
    console.log('Appending data successful')
    await browser.close()



})();

