import { useState } from 'react'

const LoginForm = ({
  handleLogin,
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()
    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={login}>
        <div>
          username
          <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
