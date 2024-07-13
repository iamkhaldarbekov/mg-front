import {makeAutoObservable} from 'mobx';
import {api} from './api';

class Store {
    user = {};
    team = {};
    auth = true;
    hasTeam = false;
    loading = true;

    constructor() {
        makeAutoObservable(this);
    }

    async init() {
        const res = await api.get('/api/users/init');

        this.setUser(res.data.user);

        if (res.data.team) {
            this.setTeam(res.data.team);
            this.setHasTeam(true);
        }

        this.setLoading(false);
    }

    setUser(data) {
        this.user = data;
    }

    setAuth(status) {
        this.auth = status;
    }

    setTeam(data) {
        this.team = data;
    }

    setHasTeam(status) {
        this.hasTeam = status;
    }

    setLoading(status) {
        this.loading = status;
    }
}

export default new Store();