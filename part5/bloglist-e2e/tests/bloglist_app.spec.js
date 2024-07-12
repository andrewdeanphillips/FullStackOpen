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

        await request.post('/api/users', {
            data: {
                username: 'user2',
                name: 'Mr 2',
                password: 'password'
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

        test('two new blogs can be created', async ({ page }) => {
            await createBlog(page, 'test blog', 'Triple H', 'www.hhh.com')
            
            const notificationDiv = await page.locator('.notification')
            await expect(notificationDiv).toContainText('a new blog test blog by Triple H added')

            const bloglistDiv = await page.locator('.blog')
            await expect(bloglistDiv.getByText('test blog Triple H')).toBeVisible()

            await createBlog(page, 'second blog', 'Triple H', 'www.hhh.com/second')
            
            const notificationDiv2 = await page.locator('.notification')
            await expect(notificationDiv2).toContainText('a new blog second blog by Triple H added')

            const bloglistDiv2 = await page.locator('.blog')
            await expect(bloglistDiv2.getByText('second blog Triple H')).toBeVisible()
        })

        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, 'test blog', 'Triple H', 'www.hhh.com')
                const notificationDiv = await page.locator('.notification')
                await expect(notificationDiv).toContainText('a new blog test blog by Triple H added')
    
            })

            test('a like can be added', async ({ page }) => {
                await page.getByRole('button', { name: 'view'}).click()
                await page.getByRole('button', { name: 'like'}).click()
                await expect(page.getByText('likes 1')).toBeVisible()
            })

            test('the creator can delete it', async ({ page }) => {
                await expect(page.locator('.blog').getByText('test blog Triple H')).toBeVisible()

                await page.getByRole('button', { name: 'view'}).click()

                page.on('dialog', dialog => dialog.accept())
                await page.getByRole('button', { name: 'remove'}).click()

                await expect(page.locator('.blog').getByText('test blog Triple H')).not.toBeVisible()
            })

            test('a different user cannot delete it', async ({ page }) => {
                await page.getByRole('button', { name: 'logout'}).click()
                await loginWith(page, 'user2', 'password')
                await expect(page.getByText('Mr 2 logged in')).toBeVisible()

                await expect(page.locator('.blog').getByText('test blog Triple H')).toBeVisible()

                await page.getByRole('button', { name: 'view'}).click()

                page.on('dialog', dialog => dialog.accept())
                await page.getByRole('button', { name: 'remove'}).click()

                const notificationDiv = await page.locator('.notification')
                await expect(notificationDiv).toContainText('Error deleting blog')

                await expect(page.locator('.blog').getByText('test blog Triple H')).toBeVisible()
            })
        })
    })




})