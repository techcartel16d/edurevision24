import { storage } from "../helper/Store"

  export const verifyToken = () => {
    try {
      const token = storage.getString('token')
      const userData = storage.getString('user')
      // console.log("Splash screen MMKV token:", token)

      if (token && userData) {
        return true
      }
      return false
    } catch (error) {
      console.log('Error verifying token:', error)
      return false
    }
  }