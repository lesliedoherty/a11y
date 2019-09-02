import AxeBuilder from 'axe-webdriverjs'
import { Options } from 'selenium-webdriver/chrome'
import { Builder } from 'selenium-webdriver'

/**
 * Get a Selenium driver instance
 *
 * @returns {Builder}
 */
const buildDriver = async () => {
  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options().headless())
    .build()
}

/**
 * Run an accessibility test on the given URL
 *
 * @param {string} testUrl
 *
 * @returns {JSON}
 */
const checkUrl = async (testUrl) => {
  const driver = await buildDriver()

  try {
    await driver.get(testUrl)
    const result = await AxeBuilder(driver).analyze()
    return result
  } finally {
    driver.quit()
  }
}

export { checkUrl }
