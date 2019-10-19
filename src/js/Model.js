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

    this.lastInvoiceNumber = "000000";
  }

  /**
   * Download invoices as array
   * @returns {Promise.<Array.<{id: string, number: number, date_created: string, date_supplied: string, comment: string}>>} invoices
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
    .then(() => {
      // invoices validation
      if (!this.isArray(this.invoices)) throw Error("View -> renderMainPage: invoices must be an Array");
      if (
        !this.invoices.every(row => {
          // eslint-disable-next-line no-underscore-dangle
          const iId = row.id;
          const iNumber = row.number;
          const iDateCreated = row.date_created;
          const iDateSupplied = row.date_supplied;
          return (
            iId
            && iNumber
            && iDateCreated
            && iDateSupplied
            && this.isString(iId)
            && this.isNumber(iNumber)
            && this.isString(iDateCreated)
            && this.isString(iDateSupplied)
          );
        })
      ) {
        throw Error(`Model -> downloadInvoices: objects in invoices must have following properties and their types:
        {id: string, number: number, date_created: string, date_supplied: string}`);
      }
    })
    .catch(error => console.error("Utils -> downloadInvoices: ", error.message));
  }

  /**
   * Delete invoice with given id from local invoices Array and from remote DB
   * @param invoiceId
   * @returns {Promise<void>}
   */
  async removeInvoice(invoiceId) {
    let invoiceArrayIndex = "";
    this.invoices.forEach((row, index) => { if (row.id === invoiceId) invoiceArrayIndex = index; });
    this.invoices.splice(invoiceArrayIndex, 1);

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

  /**
   * Returns last invoice number
   * @returns {string} lastInvoiceNumber
   */
  getLastInvoiceNumber() {
    if (!this.invoices.length) throw Error("invoices is absent or not downloaded yet");
    let lastInvoiceNumber = 0;

    this.invoices.forEach(row => { if (lastInvoiceNumber < row.number) lastInvoiceNumber = row.number; });

    return lastInvoiceNumber;
  }
}
