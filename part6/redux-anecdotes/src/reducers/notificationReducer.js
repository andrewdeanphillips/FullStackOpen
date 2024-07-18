import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotificationText(state, action) {
      console.log(action.payload)
      return action.payload
    },
    clearNotification(state, action) {
      return ''
    }
  }
})

export const { setNotificationText, clearNotification } = notificationSlice.actions

export const setNotification = (notificationText, seconds) => {
  console.log('notif here', notificationText, seconds)
  return async dispatch => {
    console.log(notificationText)
    dispatch(setNotificationText(notificationText))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer