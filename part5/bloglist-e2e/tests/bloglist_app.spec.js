const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
            await loginWith(page, 'jc28', 'the champ')
            await expect(page.getByText('John Cena logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'jc28', 'wrongpassword')
    
            const notificationDiv = await page.locator('.notification')
            await expect(notificationDiv).toContainText('wrong credentials')
            await expect(page.getByText('John Cena logged in')).not.toBeVisible()
        })

    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'jc28', 'the champ')
            await expect(page.getByText('John Cena logged in')).toBeVisible()
        })


        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'test blog', 'Triple H', 'www.hhh.com')
            
            const notificationDiv = await page.locator('.notification')
            await expect(notificationDiv).toContainText('a new blog test blog by Triple H added')

            const bloglistDiv = await page.locator('.blog')
            await expect(bloglistDiv.getByText('test blog Triple H')).toBeVisible()
        })
    })




})