
import { useEffect } from 'react';
import AllRoutes from './src/navigation/AllRoutes'
import { requestNotificationPermission } from './src/utils/requestPermissions';
import { registerNotificationListeners } from './src/utils/notificationService';

const App = () => {


  
  useEffect(() => {
    (async () => {
      requestNotificationPermission();
    })();
  }, []);


  useEffect(()=>{
    registerNotificationListeners(); // register all notification listeners
  },[])
  return (
    <>
      <AllRoutes />
    </>
  )
}

export default App