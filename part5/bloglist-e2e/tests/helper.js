const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByPlaceholder('write blog title here').fill(title)
    await page.getByPlaceholder('write author name here').fill(author)
    await page.getByPlaceholder('write blog url here').fill(url)
    await page.getByRole('button', { name: 'submit' }).click()
    await page.getByText(`a new blog ${title} by ${author} added`).waitFor();
}

const addLikes = async (page, blogElement, numberOfLikes) => {
    for (let i = 0; i < numberOfLikes; i++) {
        const likesBefore = parseInt(await blogElement.locator('.likes-count').getAttribute('data-likes'))

        await blogElement.getByRole('button', { name: 'like' }).click()
        const notificationDiv = await page.locator('.notification')
        await expect(notificationDiv).toContainText('like added')
    
    
    
        const locator = blogElement.locator('.likes-count')
        await expect(locator).toHaveAttribute('data-likes', String(likesBefore + 1))
    }
}

export { loginWith, createBlog, addLikes }