import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from 'helpers';
import { alertService } from './alert-service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${ publicRuntimeConfig.apiUrl }/users`;
const userSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user')));

export const userService = {
  user: userSubject.asObservable(),
  get userValue() { return userSubject.value; },
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete
};

async function login(username, password) {
  const user = await fetchWrapper.post(`${ baseUrl }/authenticate`, { username, password });

  // PUBLISH USER TO SUBSCRIBERS AND STORE IN LOCAL STORAGE TO STAY LOGGED IN BETWEEN PAGE REFRESHES
  userSubject.next(user);
  localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  alertService.clear();

  // REMOVE USER FROM LOCAL STORAGE, PUBLISH NULL TO USER SUBSCRIBERS AND REDIRECT TO LOGIN PAGE
  localStorage.removeItem('user');
  userSubject.next(null);
  Router.push('/account/login');
}

const register = async (user) => await fetchWrapper.post(`${ baseUrl }/register`, user);

const getAll = async () => await fetchWrapper.get(`${ baseUrl }/${ id }`);

const getById = async () => await fetchWrapper.get(`${ baseUrl }/${ id }`);

const update = async (id, params) => {
  await fetchWrapper.put(`${ baseUrl }/${ id }`, params);

  // UPDATE STORED USER IF THE LOGGED IN USER UPDATED THEIR OWN RECORD
  if (id === userSubject.value.id) {
    // UPDATE LOCAL STORAGE
    const user = { ...userSubject.value, ...params };
    localStorage.setItem('user', JSON.stringify(user));

    // PUBLISH UPDATED USER TO SUBSCRIBERS
    userSubject.next(user);
  }
};

// PREFIXED WITH _ BECAUSE DELETE IS A RESERVED WORD
const _delete = async (id) => {
  await fetchWrapper.delete(`${ baseUrl }/${ id }`);

  // AUTO LOGOUT IF THE LOGGED IN USER DELETED THEIR OWN RECORD
  if (id === userSubject.value.id) {
    logout();
  }
};