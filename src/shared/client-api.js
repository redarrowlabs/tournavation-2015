import request from 'superagent';

/**
Class used to wrap superagent into Promises.
Pass in the API base URL to use for each instance.
**/
export default class Api {
  constructor(apiBaseUrl) {
    this.baseUrl = apiBaseUrl;
  }

  fetchAll(resource) {
    console.log('*** fetchAll: ' + this.baseUrl + resource);
    return new Promise((resolve, reject) =>
      request
        .get(this.baseUrl + resource)
        .end((err, resp) => err ? reject(err) : resolve(resp.body))
    );
  }
  
  fetch(resource, id) {
    console.log('*** Fetch: ' + this.baseUrl + resource + '/' + id);
    return new Promise((resolve, reject) =>
      request
        .get(this.baseUrl + resource + '/' + id)
        .end((err, resp) => err ? reject(err) : resolve(resp.body))
    );
  }
  
  create(resource, data) {
    console.log('*** create: ' + this.baseUrl + resource);
    return new Promise((resolve, reject) =>
      request
        .post(this.baseUrl + resource)
        .send(data)
        .end((err, resp) => err ? reject(err) : resolve(resp.body))
    );
  }
  
  update(resource, id, data) {
    console.log('*** update: ' + this.baseUrl + resource + '/' + id);
    return new Promise((resolve, reject) =>
      request
        .post(this.baseUrl + resource + '/' + id)
        .send(data)
        .end((err, resp) => err ? reject(err) : resolve(resp.body))
    );
  }
};