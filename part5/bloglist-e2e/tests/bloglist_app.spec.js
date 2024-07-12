const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
                data: {
                    username: 'jc28',
                    name: 'John Cena',
                    password: 'the champ'
                }
            }
        )
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {  
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('jc28')
            await page.getByTestId('password').fill('the champ')
    
            await page.getByRole('button', { name: 'login' }).click()
    
            await expect(page.getByText('John Cena logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('jc28')
            await page.getByTestId('password').fill('wrongpassword')
    
            await page.getByRole('button', { name: 'login' }).click()
    
            const notificationDiv = await page.locator('.notification')
            await expect(notificationDiv).toContainText('wrong credentials')
            await expect(page.getByText('John Cena logged in')).not.toBeVisible()
        })

    })




})