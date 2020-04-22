import axios from 'axios';

export default {
  verify(data) {
    return axios.post('/verify', data);
  },
  register(data) {
    return axios.post('/register', data);
  },
  sendToken(data) {
    return axios.post('/sendToken', data);
  }
};
