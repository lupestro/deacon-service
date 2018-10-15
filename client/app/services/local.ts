import Service from '@ember/service';

export default class LocalService extends Service {

    get me() {
        let result = localStorage.getItem('myName');
        if (result === null) {
            result = "";
        }
        return result;
    }
    
    set me (name:string) {
        localStorage.setItem('myName', name);
    }
}