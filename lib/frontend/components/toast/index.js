import { toast } from 'react-toastify'

export function success (message = '¡Todo salió bien! 🙂', options = {}) {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...options
  })
}

export function error (message = '¡Algo salió mal! 😮', options = {}) {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...options
  })
}

export function info (message, options = {}) {
  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...options
  })
}
