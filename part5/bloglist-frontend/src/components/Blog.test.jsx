import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

//TODO: check how example solution lays out tests. All under describe?
//Use before each? or render for each test?
describe('<Blog />', () => {
    let container

    const blog = {
        id: 555555,
        user: {
            name: 'jc18'
        },
        likes: 10,
        author: 'john cena',
        title: 'winning the wwe',
        url: 'www.wwe.com',
    }

    let mockHandler



    beforeEach(() => {
        mockHandler = vi.fn()

        container = render(
            <Blog blog={blog} addLike={mockHandler} />
        ).container
    })

    test('initially renders blog title and author', async () => {
        await screen.findAllByText('winning the wwe john cena')
    })

    test('initially renders blog title and author but hides likes and url ', async () => {
        await screen.findAllByText('winning the wwe john cena')

        const div = container.querySelector('.additionalBlogInfo')
        expect(div).toHaveStyle('display: none')

    })

    test('likes and url are visible after show button is clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        const div = container.querySelector('.additionalBlogInfo')
        expect(div).not.toHaveStyle('display: none')
    })

    test('clicking the button twice calls event handler once', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('like')
        await user.click(button)
        expect(mockHandler.mock.calls).toHaveLength(1)
    })

    test('clicking the button twice calls event handler twice', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('like')
        await user.click(button)
        await user.click(button)
        expect(mockHandler.mock.calls).toHaveLength(2)
    })

    




})

/*
test('renders content', async () => {



    const element = screen.findByText('winning the wwe', { exact: false })
    expect(element).toBeDefined()

    const element2 = screen.findByText('john cena', { exact: false })
    expect(element2).toBeDefined()

    const element3 = await screen.queryByText('www.wwe.com', { exact: false })
    console.log(element3)
    expect(element3).toBeNull()

    const element4 = await screen.queryByText('likes', { exact: false })
    expect(element4).toBeNull()

})
*/

