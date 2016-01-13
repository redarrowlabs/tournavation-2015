import request from 'superagent';

/**
Class used to wrap superagent into Promises.
Pass in the API base URL to use for each instance.
**/
export default class Api {
  constructor(apiBaseUrl) {
    this.baseUrl = apiBaseUrl;
  }
  
  saveCookie(cookie) {
    this.cookie = cookie;
  }

  fetchAll(resource) {
    return new Promise((resolve, reject) => {
      let req = request
        .get(this.baseUrl + resource);
      if(this.cookie){
        req.set("Cookie", this.cookie);          
      }
      req.end((err, resp) => this.handleResponse(err, resp, reject, resolve))
    });
  }
  
  fetch(resource, id) {
    return new Promise((resolve, reject) => {
      let req = request
        .get(this.baseUrl + resource + '/' + id);
      if(this.cookie){
        req.set("Cookie", this.cookie);          
      }
      req.end((err, resp) => this.handleResponse(err, resp, reject, resolve))
    });
  }
  
  create(resource, data) {
    return new Promise((resolve, reject) => {
      let req = request
        .post(this.baseUrl + resource)
        .send(data);
      if(this.cookie){
        req.set("Cookie", this.cookie);          
      }
      req.end((err, resp) => this.handleResponse(err, resp, reject, resolve))
    });
  }
  
  update(resource, id, data) {
    return new Promise((resolve, reject) => {
      let req = request
        .put(this.baseUrl + resource + '/' + id)
        .send(data);
      if(this.cookie){
        req.set("Cookie", this.cookie);          
      }
      req.end((err, resp) => this.handleResponse(err, resp, reject, resolve))
    });
  }
  
  delete(resource, id, data) {
    return new Promise((resolve, reject) => {
      let req = request
        .delete(this.baseUrl + resource + '/' + id)
        .send(data);
      if(this.cookie){
        req.set("Cookie", this.cookie);          
      }
      req.end((err, resp) => this.handleResponse(err, resp, reject, resolve))
    });
  }
  
  handleResponse(err, resp, reject, resolve) {
      if(resp && resp.status == 401) {
          window.location.href = '/';
      } else if(err) {
          reject(err);
      } else {
          resolve(resp.body);
      }
  }
};