import {Layout} from '../containers';
import {Home, Profile, Team, SomeTeam, About, Login, Signup, User, Chats, Users} from '../pages';
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
                path: 'users',
                element: <Users />
            },
            {
                path: 'team',
                element: <Team />
            },
            {
                path: 'team/:name',
                element: <SomeTeam />
            },
            {
                path: 'chats',
                element: <Chats />
            },
            {
                path: 'chats/:chat_id',
                element: <Chat />
            },
            {
                path: 'about',
                element: <About />
            }
        ]
    },
]