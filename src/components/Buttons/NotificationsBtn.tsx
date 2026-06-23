import { Button } from '../ui/button'
import { Bell } from 'lucide-react'

const NotificationsBtn = () => {
  return (
    <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
  )
}

export default NotificationsBtn
