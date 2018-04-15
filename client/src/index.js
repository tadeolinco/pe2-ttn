import './index.css'
import 'semantic-ui-css/semantic.min.css'

import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import { SessionProvider } from './providers/SessionProvider'
import { NotificationsProvider } from './providers/NotificationsProvider'
import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <SessionProvider>
    <NotificationsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NotificationsProvider>
  </SessionProvider>,
  document.getElementById('root')
)
registerServiceWorker()
