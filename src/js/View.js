import Utils from "./Utils.js";

/**
 * Class View
 */
export default class extends Utils {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  /**
   * Add main page to document
   * @param {Array.<{id: string, number: number, date_created: string, date_supplied: string, comment: string}>} invoices invoices Array
   */
  renderMainPage(invoices) {
    const mainPage = document.createElement("div");
    mainPage.className = "main page";

    mainPage.innerHTML = `${this
    ._createHeaderHtml("Invoices")}${this
    ._createActionsPanelHtml()}${this
    ._createInvoicesPanelHtml(invoices)}`;

    document.body.appendChild(mainPage);
  }

  /**
   * Add new invoice form page to document
   * @param {number} lastInvoiceNumber - last invoice number
   */
  renderAddNewInvoicePage(lastInvoiceNumber) {
    const addNewInvoicePage = document.createElement("div");
    addNewInvoicePage.className = "addNewInvoice page";

    addNewInvoicePage.innerHTML = `${this
    ._createHeaderHtml("Create Invoice")}${this
    ._createNewInvoiceFormPanelHtml(lastInvoiceNumber)}`;

    document.body.appendChild(addNewInvoicePage);
  }

  /**
   * Returns HTML code of the header's div element
   * @param {string} headerText
   * @returns {string} htmlDiv HTML code of the header's div element
   * @private
   */
  _createHeaderHtml(headerText) {
    return `
      <div class="header">
          <p>${headerText}</p>
      </div>`;
  }

  /**
   * Returns HTML code of the actions panel div element
   * @returns {string} htmlDiv HTML code of the actions panel div element
   * @private
   */
  _createActionsPanelHtml() {
    return `
    <div class="actions panel">
        <p class="section">Actions</p>
        <div class="buttons">
            <input type="button" value="Add new">
        </div>
    </div>`;
  }

  /**
   * Returns HTML code of the invoices panel div element
   * @param {Array<{id: string, number: number, date_created: string, date_supplied: string, comment: string}>} invoicesArray
   * @returns {string} htmlDiv HTML code of the invoices panel div element
   * @private
   */
  _createInvoicesPanelHtml(invoicesArray) {
    let htmlBuffer = `
      <div class="invoices panel">
        <p class="section">Invoices</p>
        <div class="table">
          <div class="tableRow">
            <div>Create</div>
            <div>No</div>
            <div>Supply</div>
            <div>Comment</div>
            <div>Actions</div>
        </div>`;

    for (let i = 0; i < invoicesArray.length; i++) {
      /* eslint-disable no-underscore-dangle, no-bitwise */
      htmlBuffer += `
          <div class="tableRow" id="${invoicesArray[i].id}">
            <div data-header="Create:&nbsp;">${invoicesArray[i].date_created}</div>
            <div data-header="No:&nbsp;">INV-${this.formatInvoiceNumber(invoicesArray[i].number)}</div>
            <div data-header="Supply:&nbsp;">${invoicesArray[i].date_supplied}</div>
            <div data-header="Comment:&nbsp;">${invoicesArray[i].comment === undefined ? "" : invoicesArray[i].comment}</div>
            <div data-header="Actions:&nbsp;" class="buttons">
              <input type="button" value="Edit">
              <input type="button" value="Remove">
            </div>
          </div>`;
      /* eslint-enable no-underscore-dangle, no-bitwise */
    }

    htmlBuffer += `
        </div>
      </div>`;

    return htmlBuffer;
  }

  /**
   * Returns HTML code of the new invoice form panel div element
   * @param {number} lastInvoiceNumber last invoice number
   * @returns {string} htmlDiv HTML code of the new invoice form panel div element
   * @private
   */
  _createNewInvoiceFormPanelHtml(lastInvoiceNumber) {
    return `
    <div class="newInvoiceForm panel">${lastInvoiceNumber}
    </div>`;
  }
}
