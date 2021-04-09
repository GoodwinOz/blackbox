require('chromedriver')
require('jest-environment-selenium')
const webdriver = require('selenium-webdriver')
const {Builder, By, Key, util} = require('selenium-webdriver')
const { expect } = require('chai')
require('dotenv').config()

let driver 
let mainUrl = 'https://blizzard.com/en-us/'

describe('tests block', () => {
    beforeEach(async () => {
        driver = await new webdriver.Builder().forBrowser('chrome').build()
        await driver.get(mainUrl)
    }, 30000)
    afterEach(async () => {
        await driver.quit()
    }, 30000)

    describe('execute testing scenario of blizzard.com e2e', () => {
        it('should: move to header, check some elements, login as valid user, change some options, logout', async (done) => {
            const actions = driver.actions({async: true})

            //Await for page been fully loaded
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body')))

            //Click on 'Games' btn on header menu
            await driver.findElement(By.xpath('/html/body/div[1]/div/nav/div[2]/div[3]/div[3]/a[1]')).click()
            
            //Define elements by Xpath
            let diablo2Xpath = '//*[@id="Navbar-gamesDropdown"]/div[2]/div/div[1]/div[2]/div[1]/a[1]'
            let wowXpath = '//*[@id="Navbar-gamesDropdown"]/div[2]/div/div[1]/div[2]/div[2]/a[1]'
            let diablo3Xpath = '//*[@id="Navbar-gamesDropdown"]/div[2]/div/div[1]/div[2]/div[5]/a[1]'
            let moreGamesXpath = '//*[@id="Navbar-gamesDropdown"]/div[2]/nav/a[1]'
            let downloadsXpath = '//*[@id="Navbar-gamesDropdown"]/div[2]/nav/a[3]'

            //Find elements by xpath and "move cursor" on them to highlight
            let diablo2Icon = await driver.findElement(By.xpath(diablo2Xpath))
            await driver.wait(webdriver.until.elementLocated(By.xpath(diablo2Xpath)))
            await actions.move({origin: diablo2Icon}).perform()

            let wowIcon = await driver.findElement(By.xpath(wowXpath))
            await actions.move({origin: wowIcon}).perform()

            let diablo3Icon = await driver.findElement(By.xpath(diablo3Xpath))
            await actions.move({origin: diablo3Icon}).perform()
 
            await driver.sleep(300) //For defining that btn's are highlited
            let moreGamesIcon = await driver.findElement(By.xpath(moreGamesXpath))
            //Can't detect by selector (copied from console), by xpath, by full xpath. Why?
            let moreGamesText = await driver.findElement(By.css('.Navbar-gameMenuItemLabel')).getText()
            await actions.move({origin: moreGamesIcon}).perform()
            expect(moreGamesText).to.contain('More Games')

            await driver.sleep(300)
            let downloadsIcon = await driver.findElement(By.xpath(downloadsXpath))
            let downloadIconText = await driver.findElement(By.xpath("//*[ contains (text(),'Downloads') ]")).getText()
            expect(downloadIconText).to.contain('Downloads')
            await actions.move({origin: downloadsIcon}).perform()

            //Find 'login' button and click
            let myAccXpath = '/html/body/div[1]/div/nav/div[2]/div[3]/div[4]/a[2]'
            let loginXpath = '/html/body/div[1]/div/nav/div[3]/div[3]/div/div[2]/div[1]/div/a'
            await driver.findElement(By.xpath(myAccXpath)).click()

            //Waiting for login btn is enabled/visible
            await driver.wait(webdriver.until.elementLocated(By.xpath(loginXpath)))

            //Click on login btn
            await driver.findElement(By.xpath(loginXpath)).click()

            //Login (sendkeys)
            let inputMail = '//*[@id="accountName"]'
            let inputPass = '//*[@id="password"]'
            let loginBtn = '//*[@id="submit"]'
            await driver.findElement(By.xpath(inputMail)).sendKeys(process.env.BLIZZ_MAIL)
            await driver.findElement(By.xpath(inputPass)).sendKeys(process.env.BLIZZ_PASS)
            await driver.findElement(By.xpath(loginBtn)).click()

            //For shure we will simulate clicking buttons to reach user settings
            //But also we can just get endpoint: "https://account.blizzard.com/overview"

            //Simulating clicking
            let profileBtn = '/html/body/div[1]/div/nav/div[2]/div[3]/div[4]/a[2]'
            await driver.wait(webdriver.until.elementLocated(By.xpath(profileBtn)))
            await driver.findElement(By.xpath(profileBtn)).click()

            //Logged user validation
            let userMail = await driver.findElement(By.xpath('/html/body/div[1]/div/nav/div[3]/div[3]/div/div[2]/div[2]/div/div[2]')).getText()
            expect(userMail).to.contain(process.env.BLIZZ_MAIL)
            //If remove/define settngsBtn to/at top next to profileBtn => redirection will break down
            let settingsBtn = '/html/body/div[1]/div/nav/div[3]/div[3]/div/div[2]/div[2]/a[1]'
            await driver.wait(webdriver.until.elementLocated(By.xpath(settingsBtn)))
            await driver.findElement(By.xpath(settingsBtn)).click()

            //Validate if we are on "Settings" page
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[1]/main/section[2]/div/div[1]/h1')))
            let textValidation = await driver.findElement(By.xpath('/html/body/div[1]/main/section[2]/div/div[1]/h1')).getText()
            expect(textValidation).to.contain('ACCOUNT OVERVIEW')

            //Move to personal info
            let detailsBtn = "/html/body/div[1]/main/section[2]/div/div[4]/div[1]/div/div[1]/div/div[2]/a"
            await driver.wait(webdriver.until.elementLocated(By.xpath(detailsBtn)))
            await driver.findElement(By.xpath(detailsBtn)).click()

            //Update personal info (Update Name)
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[1]/main/section[2]/div/div[2]/div[1]/div/div[2]/a')))
            let updateBtn = '/html/body/div[1]/main/section[2]/div/div[2]/div[1]/div/div[2]/a'
            await driver.wait(webdriver.until.elementLocated(By.xpath(updateBtn)))
            await driver.findElement(By.xpath(updateBtn)).click()
            let firstNameInput = await driver.findElement(By.name('first-name'))
            let lastNameInput = await driver.findElement(By.name('last-name'))            
            
            await driver.wait(webdriver.until.elementLocated(By.name('first-name')))
            await firstNameInput.sendKeys(Key.CONTROL, 'a')
            await firstNameInput.sendKeys('Reed')
            await lastNameInput.sendKeys(Key.CONTROL, 'a')
            await lastNameInput.sendKeys('Red')

            //Save changes
            await driver.findElement(By.xpath('/html/body/div[1]/main/section[2]/div/div[2]/div[3]/div/div[2]/div/form/div[3]/div/button[1]')).click()
            await driver.sleep(1000)

            //New username validation //Description: R*** = Reed; R** = Red
            //Data before changes: Name = Red; Lastname = Reed. Validation successful 
            await driver.wait(webdriver.until.elementsLocated(By.xpath('/html/body/div[1]/main/section[2]/div/div[2]/div[3]/div/div[2]/div/div[1]/div[2]/span[1]')))
            let nameValidation = await driver.findElement(By.xpath('/html/body/div[1]/main/section[2]/div/div[2]/div[3]/div/div[2]/div/div[1]/div[2]/span[1]')).getText()
            expect(nameValidation).to.contain('R*** R**')

            await driver.sleep(1000)
            //Update new notifications recieving
            let notifications = '/html/body/div[1]/main/section[2]/div/div[7]/div[1]/div/div[2]/a'
            let notificationsCheckbox = '/html/body/div[1]/main/section[2]/div/div[7]/div[2]/div/div[4]/div[3]/label'
            let notificationsSaveBtn = '/html/body/div[1]/main/section[2]/div/div[7]/div[2]/div/div[5]/button[1]'
            let notificationsUpdate = await driver.findElement(By.xpath(notifications))

            // await actions.move({origin: notificationsUpdate}).perform()

            await notificationsUpdate.click()
            
            let notificationCheckboxAction = await driver.findElement(By.xpath(notificationsCheckbox))
            await notificationCheckboxAction.click()
            await driver.sleep(1000)
            await notificationCheckboxAction.click()
            
            await driver.findElement(By.xpath(notificationsSaveBtn)).click()           

            //Validate if notifications are turned off
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[1]/main/section[2]/div/div[7]/div[2]/div/div[4]/div[3]/span')))
            let newsNotifications = await driver.findElement(By.xpath('/html/body/div[1]/main/section[2]/div/div[7]/div[2]/div/div[4]/div[3]/span')).getText()
            expect(newsNotifications).to.contain('Disabled')

            done()
        }, 30000)
    })

})