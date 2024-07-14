const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, addLikes } = require('./helper')

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

                
                // Make the delete button visible
                await page.evaluate(() => {
                    const deleteButton = document.querySelector('.deleteButton');
                    deleteButton.style.display = 'block'; // Or 'inline', depending on your CSS
                });

                // Now wait for the delete button to appear and be interactable
                const deleteButton = await page.waitForSelector('.deleteButton', { state: 'visible' });

                await deleteButton.click();
                


                const notificationDiv = await page.locator('.notification')
                await expect(notificationDiv).toContainText('Error deleting blog')

                await expect(page.locator('.blog').getByText('test blog Triple H')).toBeVisible()
            })

            test('a different user will not see the delete button', async ({ page }) => {
                await page.getByRole('button', { name: 'logout'}).click()
                await loginWith(page, 'user2', 'password')
                await expect(page.getByText('Mr 2 logged in')).toBeVisible()

                await page.getByRole('button', { name: 'view'}).click()

                const removeButton = await page.getByRole('button', { name: 'remove'})
                const isVisible = await removeButton.isVisible()

                await expect(isVisible).toBeFalsy()
            })
        })

        describe('and multiple blogs exist', () =>{
            beforeEach(async ({ page }) => {
                await createBlog(page, 'blog 1', 'Triple H', 'www.hhh.com')
                await createBlog(page, 'blog 2', 'Triple H', 'www.hhh.com')
                await createBlog(page, 'blog 3', 'Triple H', 'www.hhh.com') 
            })

            test('a like can be added', async ({ page }) => {
                await page.getByText('blog 1').getByRole('button', { name: 'view'}).click()
                await page.getByRole('button', { name: 'like' }).first().click()
                await expect(page.getByText('likes 1')).toBeVisible()
            })

            test('blogs are sorted by most likes', async ({ page }) => {
                await page.getByText('blog 1').getByRole('button', { name: 'view'}).click()
                await page.getByText('blog 2').getByRole('button', { name: 'view'}).click()
                await page.getByText('blog 3').getByRole('button', { name: 'view'}).click()

                const blogs = await page.locator('.blog').all()

                const blog1 = await page.locator('.blog').filter({ hasText: 'blog 1'})
                const blog2 = await page.locator('.blog').filter({ hasText: 'blog 2'})
                const blog3 = await page.locator('.blog').filter({ hasText: 'blog 3'})


                await addLikes(page, blog1, 1)
                await addLikes(page, blog2, 2)
                await addLikes(page, blog3, 3)



                expect(await blog1.locator('.likes-count').getAttribute('data-likes')).toBe('1')
                expect(await blog2.locator('.likes-count').getAttribute('data-likes')).toBe('2')
                expect(await blog3.locator('.likes-count').getAttribute('data-likes')).toBe('3')
                
                const likesCounts = await Promise.all(
                    blogs.map(async (blog) => {
                        const likes = await blog.locator('.likes-count').getAttribute('data-likes')
                        return parseInt(likes)
                    })
                )
            
                for (let i = 0; i < likesCounts.length-1; i++) {
                    console.log(likesCounts[i])
                    expect(likesCounts[i]).toBeGreaterThanOrEqual(likesCounts[i + 1])
                }

                await addLikes(page, blog1, 4)

                for (let i = 0; i < likesCounts.length-1; i++) {
                    console.log(likesCounts[i])
                    expect(likesCounts[i]).toBeGreaterThanOrEqual(likesCounts[i + 1])
                }

            })
        })
    })




})