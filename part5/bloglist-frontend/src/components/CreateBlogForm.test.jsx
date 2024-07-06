import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'


describe('<CreateBlogForm />', () => {

    test('the form calls the event handler with the right details when a blog is created', async () => {
        const handleCreate = vi.fn()
        const user = userEvent.setup()

        render(
            <CreateBlogForm handleCreate={handleCreate} />
        )
    
        const titleInput = screen.getByPlaceholderText('write blog title here')
        const authorInput = screen.getByPlaceholderText('write author name here')
        const urlInput = screen.getByPlaceholderText('write blog url here')
        const button = screen.getByText('create')

        await user.type(titleInput, 'test title')
        await user.type(authorInput, 'test author')
        await user.type(urlInput, 'www.testurl.com')
        await user.click(button)
    
        expect(handleCreate.mock.calls).toHaveLength(1)
        
        expect(handleCreate).toHaveBeenCalledWith({
            title: 'test title',
            author: 'test author',
            url: 'www.testurl.com',
        })
    })

})

