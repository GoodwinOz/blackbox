require('chromedriver')
require('jest-environment-selenium')
const webdriver = require('selenium-webdriver')
const {Builder, By, Key, util} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const options = new chrome.Options()
const script = require('jest')
const assert = require('assert')
require('dotenv').config()

    //Chrome capabilities for testing download functions
// let chromeCapabilities = webdriver.Capabilities.chrome();
// let chromeOptions = { 'args': ['--disable-infobars'] };
// chromeCapabilities.set('chromeOptions', chromeOptions);
// capabilities.setPageLoadStrategy('normal');


let driver
let mainUrl = 'https://the-internet.herokuapp.com/'

//Alternative:
//let mainUrl = process.env.URL

describe('tests block', () => {
    beforeEach(async () => {
        driver = await new webdriver.Builder().forBrowser('chrome').build()
        await driver.get(mainUrl)
    })
    afterEach(async () => {
        await driver.close()
    }, 20000)


    describe('execute testing scenario of auth alert; #auth', () => { //Green
        it('should check a validation of input data to auth alert box', async (done) => {           
            
            usname = 'admin'
            uspass = 'admin'
            let url = "https://" + usname + ":" + uspass + "@" + "the-internet.herokuapp.com/basic_auth"
            await driver.get(url)
            
            const loginText = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            expect(loginText).toContain('Congratulations! You must have the proper credentials.')

            done()
        })
    }, 10000)

    // //Broken image

    describe.skip('execute testing scenario of broken images', () => { //Green
        it('should check which images are broken', async (done) => {
            
            await driver.get(mainUrl + 'broken_images')
    
            await driver.get(mainUrl + 'asdf.jpg')
            let brokenImage1 = await driver.findElement(By.xpath('/html/body/h1')).getText()
            if (expect(brokenImage1).toBe('Not Found')) {
                console.log('Image detected')
            } else {

                console.log('Broken')
                await driver.executeScript("window.history.go(-1)")
            }

            await driver.get(mainUrl + 'hjkl.jpg')
            let brokenImage2 = await driver.findElement(By.xpath('/html/body/h1')).getText()
            expect(brokenImage2).toBe('Not Found')
            if (brokenImage2) {
                console.log('Image detected')
            } else {        
                console.log('Broken')
                await driver.executeScript("window.history.go(-1)")
            }

            await driver.get(mainUrl + 'img/avatar-blank.jpg')
            imgVerification = await driver.getCurrentUrl()
            expect(imgVerification).toContain('img')
            
            done()
        })
    }, 20000)

    //Challenging DOM

    describe('execute testing scenario of finding elements (?)', () => { //Green     
        it('should check a valid answers of various buttons', async (done) => {
            await driver.get(mainUrl + 'challenging_dom')
            try {
                await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/div/div/div[1]')),10000)
                await driver.wait(webdriver.until.elementLocated(By.xpath("//*[contains(text(),'foo') or contains(text(),'bar') or contains(text(),'baz') or contains(text(),'qux')]")),10000)
                expect(await driver.findElement(By.xpath("//*[contains(text(),'foo') or contains(text(),'bar') or contains(text(),'baz') or contains(text(),'qux')]")).click())
            } finally {
                done()
            }       
        })
    }, 20000)

    // Checkboxes

    describe('execute testing scenario of using checkboxes', () => { //Green
        it('should use a ckeckbox', async (done) => {

            await driver.get(mainUrl + 'checkboxes')
            const actions = await driver.actions({async: true});

            await driver.wait(webdriver.until.elementLocated(By.css('input[type=\'checkbox\']')),10000)
            
            await driver.findElement(By.css('input[type=\'checkbox\']')).click()

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="checkboxes"]/input[1]')),10000)
            
            let checkbox1 = await driver.findElement(By.xpath('//*[@id="checkboxes"]/input[2]'))
            await actions.doubleClick(checkbox1).perform()
            
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="checkboxes"]/input[2]')),10000)
            await driver.findElement(By.xpath('//*[@id="checkboxes"]/input[2]')).click() 
            await driver.findElement(By.xpath('//*[@id="checkboxes"]/input[2]')).click()

            let checkbox1Value = await driver.findElement(By.xpath('//*[@id="checkboxes"]/input[1]')).getAttribute('checked')
            let checkbox2Value = await driver.findElement(By.xpath('//*[@id="checkboxes"]/input[2]')).getAttribute('checked')
            
            expect(checkbox1Value).toBeTruthy()
            expect(checkbox2Value).toBeTruthy()

            done()          
        }, 10000)  
    })

    // //Context Menu

    describe('execute testing scenario of using context menu', () => { 
        it('should trigger the alert message', async (done) => { //Green
            await driver.get(mainUrl + 'context_menu')

            await driver.actions().contextClick(driver.findElement(By.id('hot-spot')), webdriver.Button.RIGHT).perform()

            let alert = await driver.switchTo().alert();
            let alertText = await driver.switchTo().alert().getText()
            expect(alertText).toBe('You selected a context menu')
            await alert.accept();

            done()
        }, 10000)            
    })

    // //Digest Auth - 404

    // //Disappearing Elements
    // // .only - единичный запуск теста  .skip - пропуск теста (единичного)
    describe('execute testing scenario of moving mouse pointer on various elements', () => { //Green (Detectiong *gallery element* - commentet)
        it('should highlight various elements', async (done) => {
            jest.setTimeout(10000)

            await driver.get(mainUrl + 'disappearing_elements')

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/ul/li[1]/a')))
    
            let homeElement = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[1]/a'))
            let homeElementName = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[1]/a')).getText()
            await driver.actions().move({origin: homeElement}).perform()
            expect(homeElementName).toContain('Home')
    
            let aboutElement = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]'))
            let aboutElementName = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]')).getText()
            await driver.actions().move({origin: aboutElement}).perform()
            expect(aboutElementName).toBe('About')

            let contactElement = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[3]/a'))
            let contactElementName = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[3]/a')).getText()
            await driver.actions().move({origin: contactElement}).perform()
            expect(contactElementName).toBe('Contact Us')
    
            let portfolioElement = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[4]/a'))
            let portfolioElementName = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[4]/a')).getText()
            await driver.actions().move({origin: portfolioElement}).perform()
            expect(portfolioElementName).toBe('Portfolio')

            //Getting error while there is no *Gallery* element
            // if (!await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[5]/a'))) {
            //     done()
            // } else if (await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[5]/a'))) {
            //     let WaitingForGalleryElementToBeVisible = await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/ul/li[5]/a')))
            //     let galleryElement = driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[5]/a'))
            //     if(!WaitingForGalleryElementToBeVisible) {
            //         expect(!WaitingForGalleryElementToBeVisible)
            //     } else if (WaitingForGalleryElementToBeVisible) {
            //         await driver.actions().move({origin: galleryElement}).perform()
            //         expect(WaitingForGalleryElementToBeVisible)
            //     }
            // }
            done()       
        }, 10000)            
    })

    // // Drag and drop

    describe('execute testing scenario of using drag and drop', () => { //Green
        //Drag&drop by coordinates of displayed element ()
        it('should drag element "a" to position, where element "b" located', async (done) => {

            await driver.get(mainUrl + 'drag_and_drop')
    
            let elementA = await driver.findElement(By.id('column-a'))
            let elementB = await driver.findElement(By.id('column-b'))
            const actions = driver.actions({async: true})
            let coordinatesElementA = await driver.findElement(By.xpath('//*[@id="column-a"]/header')).getText()
            let coordinatesElementB = await driver.findElement(By.xpath('//*[@id="column-b"]/header')).getText()

            let offset = await elementB.getRect()
            let x = await offset.x
            let y = await offset.y

            await actions.dragAndDrop(elementA, {x:parseInt(x), y:parseInt(y)}).perform()

            // await actions.move({origin:elementA}).press().perform()
    
            // await actions.move({origin:elementB}).release().perform()

            expect(coordinatesElementA).toBe('A')
            expect(coordinatesElementA).not.toBe('B')
            expect(coordinatesElementB).toBe('B')
            expect(coordinatesElementB).not.toBe('A')

            done()
        }, 7000)
    })

    // //Dropdown List

    describe('execute testing scenario of dropdown menu', () => {  //Green
        it('should select values from dropdown menu', async (done) => {

            await driver.get(mainUrl + 'dropdown')

            await driver.wait(webdriver.until.elementLocated(By.id('dropdown')))
                        
            await driver.findElement(By.id('dropdown')).click()

            await driver.findElement(By.css('#dropdown>option[value=\'1\']')).click()
            let selectedOptionText = await driver.findElement(By.css('#dropdown>option[value=\'1\']')).getText()
            expect(selectedOptionText).toEqual('Option 1')
                
            await driver.findElement(By.css('#dropdown>option[value=\'2\']')).click()
            let secondSelectedOptionText = await driver.findElement(By.xpath('//*[@id="dropdown"]')).getText()
            expect(secondSelectedOptionText).toContain('Option 2')

            done()
        }, 10000)            
    })

    // //Dynamyc content

    describe('execute scenario of testing dynamic content', () => { //Green
        it('should dynamically change text after clicking on link', async (done) => {

            await driver.get(mainUrl + 'dynamic_content?with_content=static')

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div[3]/div[2]')),10000)
            let text1 = await driver.findElement(By.xpath('//*[@id="content"]/div[3]/div[2]')).getText()
            await driver.sleep(500)
            await driver.findElement(By.xpath('//*[@id="content"]/div/p[2]/a')).click()
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div[3]/div[2]')),10000)
            let text2 = await driver.findElement(By.xpath('//*[@id="content"]/div[3]/div[2]')).getText()
            expect(text1).not.toEqual(text2)

            done()      
        }, 10000)
    })

    //Dynamic controls

    describe('execute scenario of testing dynamic controls', () => { //Green
        it('should dynamically enable and disable elements on the page', async (done) => {

            await driver.get(mainUrl + 'dynamic_controls')
            
            await driver.wait(webdriver.until.elementLocated(By.css('input[type=\'checkbox\']')),10000)
            await driver.findElement(By.css('input[type=\'checkbox\']')).click()

            await driver.findElement(By.css('input[type=\'checkbox\']')).click()
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="checkbox-example"]/button')),10000)
            await driver.findElement(By.xpath('//*[@id="checkbox-example"]/button')).click()
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="message"]')),10000)
            let goneMsg = await driver.findElement(By.xpath('//*[@id="message"]')).getText()
            expect(goneMsg).toEqual("It's gone!")

            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div[1]/form[1]/button')),10000)
            await driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/form[1]/button')).click()

            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div[1]/form[2]/button')),10000)

            await driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/form[2]/button')).click()
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div[1]/form[2]/p')),10000)
            let enableMessage = await driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/form[2]/p')).getText()
            expect(enableMessage).toEqual('It\'s enabled!')
            
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div[1]/form[2]/p')),10000)
            await driver.findElement(By.xpath('//*[@id="input-example"]/input')).sendKeys('Test keys')            
            await driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/form[2]/button')).click()

            done()
        }, 15000 /*Musthave here; else - error: async callback was not envoked within 5k ms timeout*/)
    })

    // Dynamically loaded elements

    describe('execute scenario of testing dynamically loaded elements and pages', () => { //Green
        it('should dynamically test elements on opened pages', async (done) => {
            await driver.get(mainUrl + 'dynamic_loading')
    
            //Click on first link
            await driver.findElement(By.xpath('//*[@id="content"]/div/a[1]')).click() //Or use: await driver.get('https://the-internet.herokuapp.com/dynamic_loading/1')

            //Initiate
            await driver.findElement(By.xpath('//*[@id="start"]/button')).click()
            await driver.sleep(5500)
            await driver.wait(webdriver.until.elementLocated(By.id('finish')),10000)
            let helloMsg = await driver.findElement(By.id('finish')).getText()

            //Check if hidden element (message) is displayed
            expect(helloMsg).toBe('Hello World!')
            
            //Back to main page
            await driver.executeScript("window.history.go(-1)");
            
            //Click on second limk
            await driver.findElement(By.xpath('//*[@id="content"]/div/a[2]')).click() //Or use: await driver.get('https://the-internet.herokuapp.com/dynamic_loading/2')
    
            //Initiate
            await driver.findElement(By.xpath('//*[@id="start"]/button')).click()

            await driver.wait(webdriver.until.elementLocated(By.id('finish')),10000)
            let helloMsg2 = await driver.findElement(By.id('finish')).getText()     
            //Check if hidden message is displayed       
            expect(helloMsg2).toBe('Hello World!')

            await driver.executeScript("window.history.go(-1)");

            done()           
        }, 15000)
    })

    // //Entry Ad

    describe('execute scenario of testing a modal window functions', () => {//Green
        it('should validate modal window info and reopen it', async (done) => {

            await driver.get(mainUrl + 'entry_ad')
            
            //Get text from alert window title & body
            await driver.sleep(1500)

            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div[2]/div[2]/div[3]/p')))
            
            let windowTitle = await driver.findElement(By.xpath('//*[@id="modal"]/div[2]/div[1]')).getText()
            let windowBody = await driver.findElement(By.xpath('//*[@id="modal"]/div[2]/div[2]')).getText()

            //Validate if text in title & body meets expectations
            expect(windowTitle).toBe('THIS IS A MODAL WINDOW')
            expect(windowBody).toBe("It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something or disable their ad blocker).")

            //Closing alert window
            await driver.wait(webdriver.until.elementLocated(By.css('#modal > div.modal > div.modal-footer > p')),10000)
            await driver.findElement(By.css('#modal > div.modal > div.modal-footer > p')).click()

            //Restarting page
            await driver.wait(webdriver.until.elementLocated(By.css('#restart-ad')),10000)
            await driver.findElement(By.css('#restart-ad')).click()

            //Closing alert window againg to ensure that all is ok
            await driver.sleep(1500)
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div[2]/div[2]/div[3]/p')),10000)
            let windowTitleAfterRestart = await driver.findElement(By.css('#modal > div.modal > div.modal-title > h3')).getText()
            let windowBodyAfterRestart = await driver.findElement(By.css('#modal > div.modal > div.modal-body > p')).getText()

            //Validating window info after restart
            expect(windowTitleAfterRestart).toBe('THIS IS A MODAL WINDOW')
            expect(windowBodyAfterRestart).toBe("It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something or disable their ad blocker).")

            //Closing window after restart
            await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div[2]/div[3]/p')).click()

            done()           
        }, 15000)            
    })

    // // Exit intent

    // describe('execute scenario of testing exit intent function', () => { //Red
    //     it('should move cursor out of page borders and get alert window', async (done) => {
            
    //         await driver.get(mainUrl + 'exit_intent')
            
    //         // Store 'Exit Intent' anchor web element
    //         let link = driver.findElement(By.xpath('//*[@id="content"]/div[1]/h3'))
    //         // Capture offset positions of element
    //         let offset = await link.getRect()
    //         let x = await offset.x;
    //         let y = await offset.y;
    //         const actions = driver.actions({async: true})
    //         // Performs mouse move action onto the element
    //         await actions.move({x:parseInt(-100),y:parseInt(-50)}).pause(3000).perform();
    //         //Error here: MoveTargetOutOfBoundsError: move target out of bounds
    //         //Issue: use robot class?

    //         done()       
    //     })            
    // })

    // //File download

    // // Telling our chrome to never ask while saving files with content-type app./octet-stream
    // // options.setPreferences("browser.helperApps.neverAsk.saveToDist", "application/octet-stream") 
    describe('execute scenario of testing a download function; #download', () => { //Green without expect
        it('should download a file from test page', async (done) => { //Question: parse chrome://downloads data

            await driver.get(mainUrl + 'download')                
    
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/a[1]')))
            let fileName = await driver.findElement(By.xpath('//*[@id="content"]/div/a[1]')).getText()
            
            //Click on download link
            await driver.findElement(By.xpath('//*[@id="content"]/div/a[1]')).click()

            // await driver.get('chrome://downloads')
            // // await driver.sleep(2000)
            // await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]')), 20000)
            // let downloadFileName = await driver.findElement(By.xpath('/html/body/downloads-manager//div[2]/iron-list/downloads-item[1]//div[2]/div[2]/div[1]/span[1]')).getText()

            //Can't get downloadFileName from 'chrome://downloads (element can't be datected)

            // expect(fileName).toEqual(downloadFileName)

            // await driver.executeScript("window.history.go(-1)")  

            done()           
        }, 10000)            
    })

    // //File upload

    describe('execute scenario of testing a upload function', () => { //Green
        it('should upload a file to test page', async (done) => {
            const remote = require('selenium-webdriver/remote')

            await driver.setFileDetector(new remote.FileDetector)
            await driver.get(mainUrl + 'upload')
            
            //Click on download link
            let fileUploadInput = await driver.findElement(By.xpath('//*[@id="file-upload"]'))

            await fileUploadInput.sendKeys("/home/dev/Downloads/wl-op-25s.jpg")
    
            //Uploading file
            await driver.findElement(By.xpath('//*[@id="file-submit"]')).click()
    
            //Validate name of uploaded file
            let expectedFileName = await driver.findElement(By.xpath('/html/body/div[2]/div/div/div')).getText()
            let title = await driver.findElement(By.xpath('//*[@id="content"]/div/h3')).getText()
            expect(expectedFileName).toBe('wl-op-25s.jpg')

            //Validate if file is uploaded        
            expect(title).toBe('File Uploaded!')            

            done()         
        }, 7000)            
    })

    // //Floating menu
    // //Scroll by combination: ctrl + end; arrow down; actions.move()

    describe('execute scenario of testing a floating menu', () => { //Green
        it('should scroll down and click on floating menu bar', async (done) => {

            await driver.get(mainUrl + 'floating_menu')

            //Scroll page down
            
            let anchor = await driver.findElement(By.xpath('//*[@id="content"]/div/div[2]/div/p[6]'))
            const actions = driver.actions({async: true})

            await actions.move({origin: anchor}).perform()
    
            let url = await driver.getCurrentUrl()

            await driver.findElement(By.xpath('//*[@id="menu"]/ul/li[1]/a')).click()
            let homeUrl = await driver.getCurrentUrl()
            expect(url).not.toEqual(homeUrl)
    
            await driver.findElement(By.xpath('//*[@id="menu"]/ul/li[2]/a')).click()
            let newsUrl = await driver.getCurrentUrl()
            expect(url).not.toEqual(newsUrl)
            // expect(url).toEqual(url + '#news')

            await driver.findElement(By.xpath('//*[@id="menu"]/ul/li[3]/a')).click()
            let contactUrl = await driver.getCurrentUrl()
            expect(url).not.toEqual(contactUrl)
            // expect(url).toEqual(url + '#contact')

            await driver.findElement(By.xpath('//*[@id="menu"]/ul/li[4]/a')).click()
            let aboutUrl = await driver.getCurrentUrl()
            expect(url).not.toEqual(aboutUrl)
            // expect(url).toEqual(url + '#about')

            //Alternative
            // await driver.findElement(By.css('body')).sendKeys(Key.CONTROL, Key.END) 

            done()
        }, 10000)
    })


    // //Forgot password

    describe('execute scenario of testing a forgot password input field', () => { //Green
        it('should input into a field an email and click a *retrieve* button', async (done) => {

            await driver.get(mainUrl + 'forgot_password')

            //Input email to input field
            await driver.findElement(By.id('email')).sendKeys('random_email@gmail.com')

            await driver.findElement(By.xpath('//*[@id="form_submit"]/i')).click()

            let expectedText = await driver.findElement(By.xpath('/html/body/h1')).getText()
            expect(expectedText).toEqual('Internal Server Error') //Because of error on the page (app side problems)

            done()
        }, 10000)
    })

    // //Login Page

    describe('execute scenario of testing login & logout functions', () => { //Green
        it('should input a valid username & pass -> check if logged in -> log out -> check if logged out; #auth', async (done) => {

            await driver.get(mainUrl + 'login')
    
            //Enter username & pass
            await driver.findElement(By.id('username')).sendKeys('tomsmith')
    
            await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!')
    
            //Click login
            await driver.findElement(By.xpath('//*[@id="login"]/button')).click()
        
            //Verify if logged in
            let title = await driver.findElement(By.xpath('//*[@id="content"]/div/h2')).getText()
            expect(title).toBe('Secure Area')

            //Click logout
            await driver.findElement(By.xpath('//*[@id="content"]/div/a')).click()
    
            //Verify if logged out
            let title2 = await driver.findElement(By.xpath('//*[@id="content"]/div/h2')).getText()
            expect(title2).toBe('Login Page')
            
            done()
        }, 10000)
    })

    // //Frames

    describe('execute scenario of testing frames on page', () => { //Green
        it('should check frames on few pages', async (done) => {

            await driver.get(mainUrl + 'frames')
    
            //Check switching to frames *spoiler* See more at the bottom of doc.
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[1]/a')).click()
            
            await driver.switchTo().frame(1) //bottom
            let bot = await driver.findElement(By.xpath('/html/body')).getText()
            expect(bot).toBe('BOTTOM')
    
            //Get to the main page
            await driver.executeScript("window.history.go(-1)")

            //Switch to text input check
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]/a')).click()
    
            //Swtich to iFrame area with text input *spoiler* see more at the bottom of doc.
            await driver.switchTo().frame(driver.findElement(By.id('mce_0_ifr')))
            await driver.findElement(By.id('tinymce')).sendKeys(Key.CONTROL, 'a', Key.BACK_SPACE)
            await driver.findElement(By.id('tinymce')).sendKeys('Test text')
            let inputedText = await driver.findElement(By.id('tinymce')).getText()
            expect(inputedText).toBe('Test text')

            done()
        }, 10000)
    })

    // //Geolocation (Skipped); reason: no need to give geo.data

    // //Horizontal slider

    describe('execute scenario of testing a horizontal slider', () => { //Green 
        it('should slide a slider for generating a diffetent values', async (done) => {

            await driver.get(mainUrl + 'horizontal_slider')
      
            //Sending *right arrow* keys
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/input')).sendKeys(Key.ARROW_RIGHT, Key.ARROW_RIGHT, Key.ARROW_RIGHT)
            let sliderValue = await driver.findElement(By.xpath('//*[@id="range"]')).getText()
            expect(sliderValue).toEqual('1.5')
    
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/input')).sendKeys(Key.ARROW_LEFT, Key.ARROW_RIGHT, Key.ARROW_RIGHT)
            let secondSliderValue = await driver.findElement(By.xpath('//*[@id="range"]')).getText()
            expect(secondSliderValue).toEqual('2')
            
            done()
        }, 10000)
    })

    // //Hovers

    describe('execute scenario of testing a hover elements', () => { //Green
        it('should place a cursor on each element; information of each element should be displayed', async (done) => {

            const actions = driver.actions({async: true})
            await driver.get(mainUrl + 'hovers')

            //Getting anchors
            let userImage0 = await driver.findElement(By.xpath('//*[@id="content"]/div/div[1]/img'))
            let userImage1 = await driver.findElement(By.xpath('//*[@id="content"]/div/div[2]/img'))
            let userImage2 = await driver.findElement(By.xpath('//*[@id="content"]/div/div[3]/img'))
            
            await actions.move({origin: userImage0}).perform()
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div/div[1]/div/h5')))
            let userName1 = await driver.findElement(By.xpath('/html/body/div[2]/div/div/div[1]/div/h5')).getText()
            expect(userName1).toEqual('name: user1')
    
            await actions.move({origin: userImage1}).perform()
            let userName2 = await driver.findElement(By.xpath('/html/body/div[2]/div/div/div[2]/div/h5')).getText()
            expect(userName2).toEqual('name: user2')
    
            //Before moving to *anchor3*, coming back to ele.1, moving to ele.2, then - to ele.3
            await actions.move({origin: userImage2}).perform()
            let userName3 = await driver.findElement(By.xpath('/html/body/div[2]/div/div/div[3]/div/h5')).getText()
            expect(userName3).toEqual('name: user3')
            
            done()
        }, 10000)
    })

    // //Infinite scroll

    describe('execute scenario of testing an infinite scroll', () => { //Green
        it('should scroll a webpage', async (done) => {

            await driver.get(mainUrl + 'infinite_scroll')
            
            await driver.findElement(By.xpath('/html/body')).sendKeys(Key.SPACE, Key.SPACE)
    
            await driver.findElement(By.xpath('/html/body')).sendKeys(Key.PAGE_DOWN)

            //0 expects: text - random generated; probably can be an issue - locate changing of page coordinates
            done()
        }, 7000)
    })

    // //Inputs

    describe('execute scenario of testing input number function', () => { //Green
        it('should input a positive number, negative number, +# to number, -# to number', async (done) => {

            await driver.get(mainUrl + 'inputs')
            
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys('10')
    
            // await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys(Key.CONTROL, 'a', '-10') //Value invorrect
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys(Key.CONTROL, 'a')
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys('-10')
        
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys(Key.CONTROL, 'a')
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys('100')
        
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys(Key.CONTROL, 'a')
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys('-100')
        
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys(Key.CONTROL, 'a')
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys('0')
    
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys(Key.ARROW_UP)

            // Numbers can't be readed from input field
            // let numberAfterPushingButton = await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).getText()
            // expect(numberAfterPushingButton).toEqual('1')

            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys(Key.ARROW_DOWN)
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).sendKeys('asdasd')
            let notValidText = await driver.findElement(By.xpath('//*[@id="content"]/div/div/div/input')).getText()
            expect(notValidText).not.toEqual('asdasd')

            //Var №2 .getText(), but in this case - .getText can't be detected in inputString
            // let numberAfterPushingAnotherButton = await driver.findElement(By.css('#content > div > div > div > input[type=number]')).getText()
            // expect(numberAfterPushingAnotherButton).toBe('0')
            

            done()
        }, 7000)
    }, 15000)

    // //JQuery UI menu

    describe('execute scenario of testing JQuery UI menu', () => { // Green
        it('should check all menu positions/variables/buttons', async (done) => {

            let actions = driver.actions({async: true})
            await driver.get(mainUrl + 'jqueryui/menu')
            
            //Getting anchors
            let enabled = await driver.findElement(By.xpath('//*[@id="ui-id-3"]/a'))
            let downloads = await driver.findElement(By.xpath('//*[@id="ui-id-4"]/a'))
            let pdf = await driver.findElement(By.xpath('//*[@id="ui-id-5"]/a'))
            let csv = await driver.findElement(By.xpath('//*[@id="ui-id-6"]/a'))
            let excel = await driver.findElement(By.xpath('//*[@id="ui-id-7"]/a'))
            
            //Moving to each element in menu
            await driver.wait(webdriver.until.elementIsVisible(enabled),10000) 
            let enabledName = await driver.findElement(By.xpath('//*[@id="ui-id-3"]/a')).getText()    
            expect(enabledName).toEqual('Enabled')

            await actions.move({ origin: enabled }).perform()
            await driver.wait(webdriver.until.elementIsVisible(downloads),10000)
            let downloadsName = await driver.findElement(By.xpath('//*[@id="ui-id-4"]/a')).getText()
            expect(downloadsName).toEqual('Downloads')
            
            await actions.move({ origin: downloads }).perform()
            await driver.wait(webdriver.until.elementIsVisible(pdf),10000)
            let pdfName = await driver.findElement(By.xpath('//*[@id="ui-id-5"]/a')).getText()
            expect(pdfName).toEqual('PDF')

            await actions.move({ origin: pdf }).perform()
            await driver.wait(webdriver.until.elementIsVisible(csv),10000)
            let csvName = await driver.findElement(By.xpath('//*[@id="ui-id-6"]/a')).getText()
            expect(csvName).toEqual('CSV') 

            await actions.move({ origin: csv }).perform()
            await driver.wait(webdriver.until.elementIsVisible(excel),10000)
            let excelName = await driver.findElement(By.xpath('//*[@id="ui-id-7"]/a')).getText()
            expect(excelName).toEqual('Excel') 
            await actions.move({ origin: excel }).perform()
    
            //Testing "Back" menu button
            await driver.findElement(By.xpath('//*[@id="ui-id-8"]/a')).click()
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/ul/li/a')).click()

            done()
        }, 10000)
    })

    // //JS alerts

    describe('execute scenatio of testing js alerts', () => {//Green
        test('it should test all js alerts', async (done) => {

            await driver.get(mainUrl + 'javascript_alerts')

            //First alert
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[2]/div/div/ul/li[1]/button')),10000)
            await driver.findElement(By.xpath('/html/body/div[2]/div/div/ul/li[1]/button')).click()

            //Accepting alert
            await driver.wait(webdriver.until.alertIsPresent)
            await driver.switchTo().alert().accept()

            //Veryfi if result is valid
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="result"]')),10000)
            let result = await driver.findElement(By.xpath('//*[@id="result"]')).getText()
            expect(result).toBe('You successfully clicked an alert')

            //Second alert
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/ul/li[2]/button')),10000)
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]/button')).click()

            await driver.wait(webdriver.until.alertIsPresent)
            await driver.switchTo().alert().accept()

            //Verify if result after acception is valid
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="result"]')),10000)
            let resultOk = await driver.findElement(By.xpath('//*[@id="result"]')).getText()
            expect(resultOk).toBe('You clicked: Ok')
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]/button')).click()

            await driver.switchTo().alert().dismiss()

            //Verify if result after dismissing if valid
            let resultCancel = await driver.findElement(By.xpath('//*[@id="result"]')).getText()
            expect(resultCancel).toBe('You clicked: Cancel')

            //Third alert
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[3]/button')).click()

            //Var №2
            //W8ing for alert
            let textAlert = await driver.wait(webdriver.until.alertIsPresent())
            //Sending text
            await textAlert.sendKeys('Test text')
            await textAlert.accept()

            //Validating results of inputed text
            let textResult = await driver.findElement(By.xpath('//*[@id="result"]')).getText()
            expect(textResult).toBe('You entered: Test text')

            done()
        }, 10000)            
    })

    // //JS injections - skipped
    // //var №1 - insert into console injection: javascript: alert(document.cookie)

    // //Key presses

    describe('execute scenatio of testing key presses', () => { //Green
        test('it should display a last inputed into a string key', async (done) => {

            await driver.get(mainUrl + 'key_presses')

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="target"]')),10000)
            await driver.findElement(By.xpath('//*[@id="target"]')).sendKeys('q')
            let key = await driver.findElement(By.xpath('//*[@id="result"]')).getText()
        
            expect(key).toBe('You entered: Q')

            //Trying sendKey to body
            await driver.findElement(By.xpath('/html/body')).sendKeys('q')

            //Result = no key displayed in *you entered* field

            //Trying sendKey to input string in different languages
            await driver.findElement(By.xpath('//*[@id="target"]')).sendKeys('й')
            let key2 = await driver.findElement(By.xpath('//*[@id="target"]')).getText()

            expect(key2).toBe('')

            //Result = no difference between different languages, only eng language supported
            //й is not detected by "Result" string

            await driver.findElement(By.xpath('//*[@id="target"]')).sendKeys('qwerty')
        
            await driver.findElement(By.xpath('//*[@id="target"]')).sendKeys(Key.CONTROL, 'a')
        
            await driver.findElement(By.xpath('//*[@id="target"]')).sendKeys(Key.BACK_SPACE)
            let key3 = await driver.findElement(By.xpath('//*[@id="result"]')).getText()

            expect(key3).toBe('You entered: BACK_SPACE')

            done()
        })            
    })

    // //Large & Deep DOM 

    describe('execute scenario of testing a large DOM', () => { // Green
        it('should render a page on various "deep" and switch between "anchors"', async (done) => {
            jest.setTimeout(10000)

            let actions = driver.actions({async: true})
            await driver.get(mainUrl + 'large')
            
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="sibling-17.3"]')),10000)
            //Getting anchors (values, where cursor will me moved to)
            
            let value0 = await driver.findElement(By.xpath('//*[@id="sibling-17.3"]'))
            let value0Name = await driver.findElement(By.xpath('//*[@id="sibling-17.3"]')).getText()
            let value1 = await driver.findElement(By.xpath('//*[@id="sibling-30.3"]'))
            let value1Name = await driver.findElement(By.xpath('//*[@id="sibling-30.3"]')).getText()
            let value2 = await driver.findElement(By.xpath('//*[@id="sibling-50.3"]'))
            let value2Name = await driver.findElement(By.xpath('//*[@id="sibling-50.3"]')).getText()
            let value3 = await driver.findElement(By.xpath('//*[@id="large-table"]/tbody/tr[38]/td[1]'))
            let value3Name = await driver.findElement(By.xpath('//*[@id="large-table"]/tbody/tr[38]/td[1]')).getText()
            let value4 = await driver.findElement(By.css('#large-table > tbody > tr.row-50 > td.column-50'))
            let value4Name = await driver.findElement(By.css('#large-table > tbody > tr.row-50 > td.column-50')).getText()
            
            
            //Moving to each element in menu
            await actions.move({ origin: value0 }).perform()
            expect(value0Name).toBe('17.3')
            await actions.move({ origin: value1 }).perform()
            expect(value1Name).toBe('30.3')
            await actions.move({ origin: value2 }).perform()
            expect(value2Name).toBe('50.3')
            await actions.move({ origin: value3 }).perform()
            expect(value3Name).toBe('38.1')
            await actions.move({ origin: value4 }).perform()
            expect(value4Name).toBe('50.50')

            await actions.move({ origin: value0 }).perform()
            //"Jumping" because of actions = async?
            
            //Back to top
            done()
        })
    },10000)

    // //New window
    
    describe('execute scenario of testing opening a new window', () => {//Green
        it('should open a new window after clicking a link and switch on it ', async (done) => {

            await driver.get(mainUrl + 'windows')
            const originalWindow = await driver.getWindowHandle()       
            assert((await driver.getAllWindowHandles()).length === 1)
    
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/a')),10000)

            //Getting anchors
            await driver.findElement(By.xpath('//*[@id="content"]/div/a')).click()

            await driver.get(mainUrl + 'windows/new')
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/body/div[1]/h3')),10000)
            let titleCheck = await driver.findElement(By.xpath('/html/body/div[1]/h3')).getText()
            expect(titleCheck).toBe('New Window')

            await driver.get(mainUrl + 'windows')

            //Wait for a new window handle
            await driver.wait(
                async () => (await driver.getAllWindowHandles()).length === 2,
                10000
            )
            //Switch back to original window
            await driver.switchTo().window(originalWindow)
            await driver.wait(webdriver.until.elementsLocated(By.xpath('//*[@id="content"]/div/h3')))
            let mainpageTitle = await driver.findElement(By.xpath('//*[@id="content"]/div/h3')).getText()
            expect(mainpageTitle).toEqual('Opening a new window')

            //Switch to a New window tab
            const windows = await driver.getAllWindowHandles()
            windows.forEach(async handle => {
                if (handle !== originalWindow) {
                    await driver.switchTo().window(handle)
                }
            })
            await driver.close()
            done()
        }, 10000)
    }, 10000)

    // //Nested Frames

    describe('execute scenario of testing nested frames on page', () => { //Green
        it('should check nested frames info on pages', async (done) => {

            await driver.get(mainUrl + 'nested_frames')
            
            //Bottom
            await driver.wait(webdriver.until.elementLocated(By.xpath('/html/frameset')),10000)
            await driver.switchTo().frame(1) 
            let bottom = await driver.findElement(By.xpath('/html/body')).getText()
            expect(bottom).toBe('BOTTOM')
            await driver.switchTo().defaultContent()


            //Was hard.
            await driver.switchTo().frame(0) //Switch to frameset
            await driver.switchTo().frame(0) //Switch to left frame
            let left = await driver.findElement(By.xpath('/html/body')).getText()
            expect(left).toBe('LEFT')

            await driver.switchTo().defaultContent()
            await driver.switchTo().frame(0) //Switch to frameset
            await driver.switchTo().frame(1) //Switch to middle frame
            let middle = await driver.findElement(By.xpath('/html/body')).getText()
            expect(middle).toBe('MIDDLE')

            await driver.switchTo().defaultContent()
            await driver.switchTo().frame(0) //Switch to frameset
            await driver.switchTo().frame(2) //Switch to right frame
            let right = await driver.findElement(By.xpath('/html/body')).getText()
            expect(right).toBe('RIGHT')
            
            done()
        }, 10000)
    }, 10000)

    // //Notification message

    describe('execute scenario of testing a notification message generator', () => { //Green
        it('should generate a various notification messages afret clicking on btn', async (done) => {

            await driver.get(mainUrl + 'notification_message_rendered')

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/p/a')),10000)

            await driver.findElement(By.xpath('//*[@id="content"]/div/p/a')).click()

            //Get text from flash message
            await driver.wait(webdriver.until.elementLocated(By.id('flash')),10000)
            let notificationMessageText = await driver.findElement(By.id('flash')).getText()
            //Find element with multiple text variables included into notification -> || analogue
            //If such variable exist -> expect: true; if not: false
            let notificationMessageGeneratedText = await driver.findElement(By.xpath("//*[contains(text(), 'Action successful') or contains(text(), 'Action unsuccesful, please try again')]")).getText()
            expect(notificationMessageText).toBe(notificationMessageGeneratedText)
            
            done()
        }, 10000)
    })

    // //Redirection

    describe('execute scenario of testing a redirection', () => { //Green with question: parse http status from console, only with selenium/webdriver
        it('should redirect on pages with various statuses.', async (done) => {

            await driver.get(mainUrl + 'redirector')

            //Open a redirect list
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="redirect"]')),10000)
            await driver.findElement(By.xpath('//*[@id="redirect"]')).click()
            let url = await driver.getCurrentUrl()
            expect(url).toBe('https://the-internet.herokuapp.com/status_codes')

            //Start checking status pages
            //Status 200
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/ul/li[1]/a')),10000)
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[1]/a')).click()

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/p')),10000)
            let status200 = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            let status200text = await driver.findElement(By.xpath("//*[contains(text(), 'This page returned a 200 status code.')]")).getText()
            expect(status200).toBe(status200text)

            await driver.executeScript("window.history.go(-1)");
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/ul/li[1]/a')),10000)

            //Status 301
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]/a')).click()

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/p')),10000)
            let status301 = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            let status301text = await driver.findElement(By.xpath("//*[contains(text(), 'This page returned a 301 status code.')]")).getText()
            expect(status301).toBe(status301text)

            await driver.executeScript("window.history.go(-1)");
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/ul/li[1]/a')),10000)

            //Status 404
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[3]/a')).click()

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/p')),10000)
            let status404 = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            let status404text = await driver.findElement(By.xpath("//*[contains(text(), 'This page returned a 404 status code.')]")).getText()
            expect(status404).toBe(status404text)

            await driver.executeScript("window.history.go(-1)");
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/ul/li[1]/a')),10000)

            //Status 500
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[4]/a')).click()

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/p')),10000)
            let status500 = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            let status500text = await driver.findElement(By.xpath("//*[contains(text(), 'This page returned a 500 status code.')]")).getText()
            expect(status500).toBe(status500text)

            await driver.executeScript("window.history.go(-1)");
        
            done()
        }, 10000)
    })

    // //Secure downloading

    //Telling our chrome to never ask while saving files with content-type app./octet-stream
    // options.setPreferences("browser.helperApps.neverAsk.saveToDist", "application/octet-stream") 

    describe('execute scenario of testing a secured download function; #auth #download', () => { //Green with questions: alert is not handeled/detected
        it('should sign in like admin user and download a file', async (done) => {

            uname = 'admin'
            pass = 'admin'
            let url = "https://" + uname + ":" + pass + "@" + "the-internet.herokuapp.com/download_secure"
            await driver.get(url)
            expect(url).toEqual('https://admin:admin@the-internet.herokuapp.com/download_secure')

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/a[1]')),10000)
            await driver.findElement(By.xpath('//*[@id="content"]/div/a[1]')).click()


            // await driver.findElement(By.name("Username")).sendKeys("admin")
                
            // await driver.findElement(By.name("Password")).sendKeys("123")
                
            //Switching to alert
            // await driver.wait(webdriver.until.alertIsPresent())
            // let alert = await driver.switchTo().alert()
            // await alert.sendKeys('admin')
            // await alert.sendKeys(Key.TAB)
            // await alert.sendKeys('admin')


            done()          
        }, 10000)            
    })

    // //Shadow DOM

    describe('execute scenario of testing text in shadow frame', () => {  //Green
        it('should get and check text from shadow frames', async (done) => {

            await driver.get(mainUrl + 'shadowdom')

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/my-paragraph[1]/span')),10000)
            //Get text from span
            let text0 = await driver.findElement(By.xpath('//*[@id="content"]/my-paragraph[1]/span')).getText()
            expect(text0).toBe('Let\'s have some different text!')

            //Get text from fist <li>
            let text1 = await driver.findElement(By.xpath('//*[@id="content"]/my-paragraph[2]/ul/li[1]')).getText()
            expect(text1).toBe('Let\'s have some different text!')

            //Get text from second <li>
            let text2 = await driver.findElement(By.xpath('//*[@id="content"]/my-paragraph[2]/ul/li[2]')).getText()
            expect(text2).toBe('In a list!')

            done()
        }, 10000)
    })

    // //Shifting content

    describe('execute scenario of testing a shifting buttons', () => { //Green with questions: parse html data after every page reload
        it('should move coursor on each shifted and unshifted button', async (done) => {
            jest.setTimeout(15000)
            const actions = driver.actions({async: true})
            await driver.get(mainUrl + 'shifting_content')
            
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/a[1]')),10000)

            //First link
            await driver.findElement(By.xpath('//*[@id="content"]/div/a[1]')).click()

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/p[3]/a')),10000)
            await driver.findElement(By.xpath('//*[@id="content"]/div/p[3]/a')).click()

            //Anchors            
            let home = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[1]/a')).getText()
            expect(home).toEqual('Home')

            // let about = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]/a'))
            // let contactUs = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[3]/a'))
            // let portfolio = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[4]/a'))
            // let gallery = await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[5]/a'))
            
            let releaseAnchors = async function() {
                await actions.move({origin:await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[1]/a'))}).perform()
                await actions.move({origin:await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]/a'))}).perform()
                await actions.move({origin:await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[3]/a'))}).perform()
                await actions.move({origin:await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[4]/a'))}).perform()
                await actions.move({origin:await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[5]/a'))}).perform()
            }
            await releaseAnchors()
            
            let urlBeforeRandoming = driver.getCurrentUrl()
            await driver.get(mainUrl + 'shifting_content/menu?mode=random')
            let urlAfterRandoming = driver.getCurrentUrl()
            expect(urlBeforeRandoming).not.toBe(urlAfterRandoming)

            let urlBeforeShifring = driver.getCurrentUrl()
            await driver.get(mainUrl + 'shifting_content/menu?pixel_shift=100')
            let urlAfterShifring = driver.getCurrentUrl()
            expect(urlBeforeShifring).not.toBe(urlAfterShifring)

            let urlBeforeRandomShifting = driver.getCurrentUrl()
            await driver.get(mainUrl + 'shifting_content/menu?mode=random&pixel_shift=100')
            let urlAfterRandomShifting = driver.getCurrentUrl()
            expect(urlBeforeRandomShifting).not.toBe(urlAfterRandomShifting)

            //Come back to main page
            await driver.get(mainUrl + 'shifting_content')
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/a[2]')),10000)

            //Select second example
            await driver.findElement(By.xpath('//*[@id="content"]/div/a[2]')).click()

            //Image shifting
            let urlBeforeRandomingImage = driver.getCurrentUrl()
            await driver.get(mainUrl + 'shifting_content/image?mode=random')
            let urlAfterRandomingImage = driver.getCurrentUrl()
            expect(urlBeforeRandomingImage).not.toBe(urlAfterRandomingImage)

            let urlBeforeShiftingImage = driver.getCurrentUrl()
            await driver.get(mainUrl + 'shifting_content/image?pixel_shift=100')
            let urlAfterShiftingImage = driver.getCurrentUrl()
            expect(urlBeforeShiftingImage).not.toBe(urlAfterShiftingImage)

            let urlBeforeRandomShiftingImage = driver.getCurrentUrl()
            await driver.get(mainUrl + 'shifting_content/image?mode=random&pixel_shift=100')
            let urlAfterRandomShiftingImage = driver.getCurrentUrl()
            expect(urlBeforeRandomShiftingImage).not.toBe(urlAfterRandomShiftingImage)

            await driver.get(mainUrl + 'shifting_content/image?image_type=simple')

            //Come back to main page
            await driver.get(mainUrl + 'shifting_content')
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/a[3]')),10000)

            //Select third example
            await driver.findElement(By.xpath('//*[@id="content"]/div/a[3]')).click()
            await driver.navigate().refresh()
            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/div/div')),10000)
            let generatedText = await driver.findElement(By.xpath('//*[@id="content"]/div/div/div')).getText()
            await driver.navigate().refresh()
            let generatedTextAfterRefresh = await driver.findElement(By.xpath('//*[@id="content"]/div/div/div')).getText()
            expect(generatedText).not.toBe(generatedTextAfterRefresh)

            await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="content"]/div/div/div')),10000)
            await driver.navigate().refresh()

            done()
        }, 15000)
    }, 15000)

    // //Slow Resources - skipped; reason: (after 30s - 503 error)

    // //Sortable data tables - skipped; reason: nothing to test, pushable buttons with 0 effect

    // //Status codes (duplicate of redirection)

    describe('execute scenario of testing status codes page', () => { //Green
        it('should get and check text from shadow frames', async (done) => {

            await driver.get(mainUrl + 'status_codes')

            //Start checking status pages
            //Status 200
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[1]/a')).click()

            let status200 = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            let status200text = await driver.findElement(By.xpath("//*[contains(text(), 'This page returned a 200 status code.')]")).getText()
            expect(status200).toBe(status200text)

            await driver.executeScript("window.history.go(-1)");

            //Status 301
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[2]/a')).click()

            let status301 = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            let status301text = await driver.findElement(By.xpath("//*[contains(text(), 'This page returned a 301 status code.')]")).getText()
            expect(status301).toBe(status301text)

            await driver.executeScript("window.history.go(-1)");

            //Status 404
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[3]/a')).click()

            let status404 = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            let status404text = await driver.findElement(By.xpath("//*[contains(text(), 'This page returned a 404 status code.')]")).getText()
            expect(status404).toBe(status404text)

            await driver.executeScript("window.history.go(-1)");

            //Status 500
            await driver.findElement(By.xpath('//*[@id="content"]/div/ul/li[4]/a')).click()
            let status500 = await driver.findElement(By.xpath('//*[@id="content"]/div/p')).getText()
            let status500text = await driver.findElement(By.xpath("//*[contains(text(), 'This page returned a 500 status code.')]")).getText()
            expect(status500).toBe(status500text)
            await driver.executeScript("window.history.go(-1)");
            
            done()
        }, 10000)
    }, 15000)

    // //Typos

    describe('execute scenario of testing status codes page', () => { //Green with question: triggering if/else if statements
        it('should get and check text from shadow frames', async (done) => {

            await driver.get(mainUrl + 'typos')

            //Start refreshin page and checking text
            expect(await driver.findElement(By.xpath('//*[contains(text(), "Sometimes you\'ll see a typo, other times you won\'t.") or contains(text(), "Sometimes you\'ll see a typo, other times you won,t.")]')))

            let text = await driver.findElement(By.xpath('//*[@id="content"]/div/p[2]')).getText()

            let magic = async function () { 
                //When else if statement triggered => console.log from if statement
                if (
                    text = "Sometimes you'll see a typo, other times you won't."
                ) {
                    console.log('Nothing interested')
                } 
                else if (
                    text = "Sometimes you'll see a typo, other times you won,t."
                ) {
                    console.log(`Magic happens with text! ${text}`)
                }
            }
            await magic()

            await driver.navigate().refresh()
            expect(await driver.findElement(By.xpath('//*[contains(text(), "Sometimes you\'ll see a typo, other times you won\'t.") or contains(text(), "Sometimes you\'ll see a typo, other times you won,t.")]')))
            await magic()

            await driver.navigate().refresh()
            expect(await driver.findElement(By.xpath('//*[contains(text(), "Sometimes you\'ll see a typo, other times you won\'t.") or contains(text(), "Sometimes you\'ll see a typo, other times you won,t.")]')))
            await magic()


            done()
        }, 8000)
    })

    // //Editor

    describe('execute scenario of testing text editor', function() {   
        it('should input text to editor', async (done) => {

            await driver.get(mainUrl + 'tinymce')

            //Start checking text editor
            await driver.switchTo().frame(driver.findElement(By.id('mce_0_ifr')))
            await driver.findElement(By.id('tinymce')).sendKeys(Key.CONTROL, 'a', Key.BACK_SPACE)
            await driver.findElement(By.id('tinymce')).sendKeys('Test text')
            let textValidation = await driver.findElement(By.id('tinymce')).getText()
            expect(textValidation).toBe('Test text')

            await driver.findElement(By.id('tinymce')).sendKeys(Key.CONTROL, 'a')
            //Exit from iFrame (text input area)
            await driver.switchTo().defaultContent()
            //Making text bold
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div[1]/div[1]/div[2]/div/div[3]/button[1]')).click()

            //Align Center
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div[1]/div[1]/div[2]/div/div[4]/button[2]')).click()

            //Make text "Italic"
            await driver.findElement(By.xpath('//*[@id="content"]/div/div/div[1]/div[1]/div[2]/div/div[3]/button[2]')).click()

            done()
        }, 10000)
    }, 10000)
})