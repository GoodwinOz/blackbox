describe('Example', () => { 
  beforeEach(() => {
      browser.url('https://webdriver.io')
  })

  it('should save a screen of page example', async () => {
    // Save a screen
    await browser.saveScreen('examplePaged', { /* some options */ })
  })

  it('should compare a page example', async () => {
    // Check a screen
    expect(await browser.checkScreen('examplePaged', { /* some options */ })).toEqual(0)   
  })

  it('should make a full page screen and save it', async () => {
    // Save a full page screenshot
    await browser.saveFullPageScreen('fullPage', { /* some options */ })
  })

  it('should compare a saved screen of full page', async () => {
    // Check a full page screenshot
    expect(await browser.checkFullPageScreen('fullPage', { /* some options */ })).toEqual(0)
  })

  it('should save element by id', async () => {
    // Should save element by id
    let element = await $('#__docusaurus > div.main-wrapper > header > div > div.buttons_1Wc3 > a:nth-child(4)')
    await browser.saveElement(element, 'supportButton', { /* some options */ })
  })

  it('should check an element', async () => { 
    // Check an element by id
    let element = await $('#__docusaurus > div.main-wrapper > header > div > div.buttons_1Wc3 > a:nth-child(4)')
    expect(await browser.checkElement(element, 'supportButton')).toEqual(0)
  })
})