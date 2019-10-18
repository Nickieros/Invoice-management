import Utils from "./Utils.js";

/**
 * Class Model
 */
export default class extends Utils {
  constructor() {
    super();
    const PROTOCOL = "http";
    const HOST = "localhost";
    const PORT = "3000";
    this.DATA_SOURCE_NAME = `${PROTOCOL}://${HOST}:${PORT}`;

    /**
     * Array of invoices
     * @type {Array.<{_id: string, number: number, date_created: string, date_supplied: string, comment: string}>}
     */
    this.invoices = [];
  }

  /**
   * Download invoices as array
   * @returns {Promise.<Array.<{_id: string, number: number, date_created: string, date_supplied: string, comment: string}>>} invoices
   */
  async downloadInvoices() {
    await fetch(
      `${this.DATA_SOURCE_NAME}/invoices`,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded;" },
        method: "GET",
        mode: "cors",
      },
    )
    .then(response => !this._validateResponse(response) || response.json())
    .then(json => { this.invoices = Object.values(JSON.parse(JSON.stringify(json))); })
    .catch(error => console.error("Utils -> downloadInvoices: ", error.message));
  }

  async removeInvoice(invoiceId) {
    await fetch(
      `${this.DATA_SOURCE_NAME}/invoices/${invoiceId}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        mode: "cors",
      },
    )
    .then(response => this._validateResponse(response))
    .catch(error => console.error("Utils -> removeInvoice: ", error.message));
  }

  /**
   * Validate fetch response from the server. Returns true if validation is successful, else throw error
   * @param {Response} response fetch response from server
   * @private
   */
  _validateResponse(response) {
    if (!response.ok) { // Client (400-500) and server (500-600) errors responses
      throw Error(`_validateResponse() found client error: ${response.status} ${response.statusText} when fetching ${response.url}`);
    }
    return true;
  }
}
