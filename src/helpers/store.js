import {makeAutoObservable} from 'mobx';

class Store {
    user = {};
    team = {};
    auth = false;
    hasTeam = false;
    loading = true;

    constructor() {
        makeAutoObservable(this);
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
}

export default new Store();