import axios from 'axios'
import {server_url} from '../server_host.js';
const server = server_url;
export const blog_get = data => {
    return axios
    .get((server+'blog/blog_get/'+data.id), {
    })
    .then(res => {
        return res.data;
    });
}

export const event_update = data => {
    return axios
    .post((server+"event/event_update/"+data.id), data.data)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        console.log(err);
    })
}