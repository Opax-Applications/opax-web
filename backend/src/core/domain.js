import fetch from 'node-fetch';
import { parseString } from 'xml2js';

import DomainModel from '../models/domain.model';


export default class Domain {
  
  /**
   * Domain constructor.
   * @param {string} name - domain name
   */
  constructor(name) {
    /** @member {string} - domain name */
    this.name = name;
  }
  
  /**
   * Save a new domain in the database.
   * @returns {Promise}
   */
  saveNew() {
    const domain = new DomainModel({
      name: this.name
    });
    return domain.save()
      .then((domainObject) => this.dbObject = domainObject)
      .catch((err) => console.error("Error saving new domain:", err));
  }
  
  /**
   * this is just a version of xml2js' parseString using Promises
   * @param {string} text
   * @returns {Promise<Object>}
   */
  parseXML(text) {
    return new Promise((resolve, reject) => {
      parseString(text, (err, result) => {
        if (result) {
          resolve(result);
        }
        reject(err);
      });
    });
  }
  
  /**
   * @returns {string}
   */
  sitemapURL() {
    return 'http://' + this.name + '/sitemap.xml';
  }
  
  /**
   * Try to read the sitemap.xml file for the domain.
   * @returns {Promise<Object>}
   */
  readSitemap() {
    const url = this.sitemapURL();
    return fetch(url, {
      method: 'GET', redirect: 'follow'
    })
      .then(res => {
        if (res.status == 404)
          throw new Error("sitemap.xml was not found at " + url);
        const mime = res.headers.get('content-type');
        if (mime !== 'text/xml' && mime !== 'application/xml')
          throw new Error("sitemap.xml has a wrong MIME type at " + url);
        return res.text();
      })
      .then((text) => this.parseXML(text));
  }
}
