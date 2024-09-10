import './index.css';
import {createRoot} from 'react-dom/client';
import {createHashRouter, RouterProvider} from 'react-router-dom';

import {routes} from './helpers/routes';

// Используется HashRouter для gh-pages
const router = createHashRouter(routes);

createRoot(document.querySelector("#application")).render(<RouterProvider router={router} />);