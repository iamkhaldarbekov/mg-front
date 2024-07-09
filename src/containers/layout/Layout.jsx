import './layout.scss';
import {Outlet, Navigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useEffect} from 'react';

import {Nav, Loader} from '../../components';
import Store from '../../helpers/store';

function Layout() {
  useEffect(() => {
    Store.init();
  }, []);

  if (!Store.auth) {
    return <Navigate to='/login' />
  }

  if (Store.loading) {
    return <Loader />
  }

  return (
    <div className="wrapper">
        <Nav />
        <Outlet />
    </div>
  )
}

export default observer(Layout);