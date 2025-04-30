 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import 'antd/dist/reset.css'
import '@aws-amplify/ui-react/styles.css'
import './index.css'

import Router from './Router'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'

import config from './aws-exports'
Amplify.configure(config)


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    </StrictMode>,
)