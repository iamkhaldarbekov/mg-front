import './layout.scss';
import {Outlet, Navigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useEffect, useState} from 'react';

import {Nav, Loader} from '../../components';
import Store from '../../helpers/store';
import {api} from '../../helpers/api';

function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('acstkn')) {
      setLoading(false);
      return;
    }

    api.get('/api/users/init')
    .then(res => {
      Store.setUser(res.data.user);
      
      if (res.data.team) {
        Store.setTeam(res.data.team);
        Store.setHasTeam(true);
      } else {
        Store.setTeam({});
        Store.setHasTeam(false);
      }

      Store.setAuth(true);
    })
    .catch(e => Store.setAuth(false))
    .finally(() => setLoading(false))
  }, []);

  if (loading) {
    return <Loader />
  }

  if (!Store.auth) {
    return <Navigate to='/login' />
  }

  return (
    <div className="wrapper">
        <Nav />
        <Outlet />
    </div>
  )
}

export default observer(Layout);