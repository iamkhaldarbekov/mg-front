import {Layout} from '../containers';
import {Home, Profile, Team, About, Login, Signup, User} from '../pages';
import {Chat} from '../components';

export const routes = [
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: ':username',
                element: <User />
            },
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'team',
                element: <Team />
            },
            {
                path: 'chat',
                element: <Chat />
            },
            {
                path: 'about',
                element: <About />
            }
        ]
    },
]