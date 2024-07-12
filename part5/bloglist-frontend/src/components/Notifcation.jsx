const Notification = ({ color, text }) => {
  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }


  if (text === '') {
    return null
  }

  return (
    <div className='notification' style={notificationStyle}>
      {text}
    </div>
  )
}

export default Notification