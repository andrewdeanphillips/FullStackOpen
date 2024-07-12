const { test, expect, beforeEach, describe } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
    await page.goto('/')

    const locator = await page.getByText('username')
    await expect(locator).toBeVisible()
})

describe('Blog app', () => {
    beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {  
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })
})