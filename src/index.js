import {createRoot} from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import {routes} from './helpers/routes';

const router = createBrowserRouter(routes);

createRoot(document.querySelector("#application")).render(<RouterProvider router={router} />);