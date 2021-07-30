import PageModel from '../models/page.model';
import PageAudit from "../models/pageAudit.model";

export default class Page {

  /**
   * Page constructor.
   * @param {Audit} audit
   * @param {Domain} domain
   * @param {string} url
   * @param {Number} status - status returned by the HEAD request
   */
  constructor(audit, domain, url, status) {
    /** @member {Audit} */
    this.audit = audit;
    /** @member {Domain} */
    this.domain = domain;
    /** @member {string} */
    this.url = url;
    /** @member {Number} */
    this.status = status;
    /** @member {string} */
    this.errorMessage = null;
    /** @member {PageModel} - database object for this page */
    this.dbObject = null;
  }

  /**
   * Load the page, and calls contentLoaded() or handleError().
   */
  async startChecking() {
    console.log("** startChecking " + this.url);
    try {
      await this.audit.driver.get(this.url);
      const delay = this.audit.params.postLoadingDelay;
      if (delay > 0)
        await new Promise(resolve => setTimeout(resolve, delay));
      this.contentLoaded();
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * Extract the links and start analyzing the page with aXe.
   * Call aXeResults() when done.
   */
  contentLoaded() {
    console.log("contentLoaded");
    this.audit.extractLinks(this)
      .then(() => {
        console.log("aXe analyze");
        this.audit.aXeB.run((err, results) => {
          if (err) {
            console.log("aXe analyze error for " + this.url + ":");
            console.log(err);
            if (this.errorMessage == null)
              this.errorMessage = err;
          }
          this.aXeResults(results);
        });
      });
  }

  /**
   * Update the list of violations based on aXe's results,
   * and call saveAndContinue().
   * @param {Object} results
   */
  aXeResults(results) {
    this.save().then(() => {
      let violations = [];
      let nbViolations = 0;

      if (results != null) {
        const violationsFromResult = results.violations;
        for (const violation of violationsFromResult) {
          const nodes = [];
          for (const node of violation.nodes) {
            nodes.push({
              target: node.target.flat().join(),
              html: node.html
            });
          }
          let category = null;
          if (violation.tags instanceof Array) {
            for (const t of violation.tags) {
              if (t.indexOf('cat.') === 0) {
                category = t.substring(4);
                break;
              }
            }
          }
          violations.push({
            id: violation.id,
            descLink: violation.helpUrl,
            description: violation.description,
            impact: violation.impact,
            nodes: nodes,
            category: category,
          });
          nbViolations += nodes.length;
        }
      }
      const pageAudit = new PageAudit({
        ...params,
        pageId: this.dbObject._id,
        errorMessage: this.errorMessage,
        dateEnded: new Date(),
        nbViolations: nbViolations,
        violations: violations,
        complete: true
      });
      return pageAudit.save();
    }).then(() => {
      this.audit.continueAudit(this);
    });
  }

  /**
   * Create a new web driver if needed, and call saveAndContinue().
   * @param {Error} error
   */
  async handleError(error) {
    console.log("Error in driver.get (" + error.name + ") for " + this.url + ": ");
    console.log(error);
    this.errorMessage = error.message;
    // name = NoSuchSessionError, message = Tried to run command without establishing a connection
    if (error.name.indexOf('NoSuchSessionError') === 0 ||
        error.name.indexOf('TimeoutError') === 0 ||
        error.name.indexOf('WebDriverError') === 0)
      await this.audit.createNewDriver();
    await this.save().then(()=>{this.audit.continueAudit(this)});
  }

  /**
   * Save the page in the database and call audit.continueAudit().
   */
  save() {
    const page = new PageModel({
      domainId: this.domain.dbObject._id,
      url: this.url,
      status: this.status,
      errorMessage: this.errorMessage
    });
    return page.save().then((pageObject) => this.dbObject = pageObject);
  }
}
