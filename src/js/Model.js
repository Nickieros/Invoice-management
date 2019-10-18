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
    .then(response => response.json())
    .then(json => { this.invoices = Object.values(JSON.parse(JSON.stringify(json))); })
    .catch(error => console.error("Utils->downloadInvoices: ", error.message));
  }
}
