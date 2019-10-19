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
  renderPageMain(invoices) {
    const mainPage = document.createElement("div");
    mainPage.className = "page main";

    mainPage.innerHTML = `${this
    ._createHtmlHeader("Invoices")}${this
    ._createHtmlActionsPanel()}${this
    ._createHtmlInvoicesPanel(invoices)}`;

    document.body.appendChild(mainPage);
  }

  /**
   * Add to document a page with a form for adding a new invoice
   * @param {number} lastInvoiceNumber - last invoice number
   */
  renderPageAddNewInvoice(lastInvoiceNumber) {
    const addNewInvoicePage = document.createElement("div");
    addNewInvoicePage.className = "page addNewInvoice";

    addNewInvoicePage.innerHTML = `${this
    ._createHtmlHeader("Create Invoice")}${this
    ._createHtmlAddNewInvoiceFormPanel(lastInvoiceNumber)}`;

    document.body.appendChild(addNewInvoicePage);
  }

  /**
   * Returns HTML code of the header's div element
   * @param {string} headerText
   * @returns {string} htmlDiv HTML code of the header's div element
   * @private
   */
  _createHtmlHeader(headerText) {
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
  _createHtmlActionsPanel() {
    return `
    <div class="panel actions">
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
  _createHtmlInvoicesPanel(invoicesArray) {
    let htmlBuffer = `
      <div class="panel invoices">
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
   * Returns HTML code of the add new invoice form panel div element
   * @param {number} lastInvoiceNumber last invoice number
   * @returns {string} htmlDiv HTML code of the add new invoice form panel div element
   * @private
   */
  _createHtmlAddNewInvoiceFormPanel(lastInvoiceNumber) {
    return `
    <div class="panel addNewInvoiceForm">${lastInvoiceNumber}
    </div>`;
  }

  /**
   * Show main page
   */
  showPageMain() {
    this._show(".page.main");
  }

  /**
   * Show page with form for adding a new invoice
   */
  showPageAddNewInvoice() {
    this._show(".page.addNewInvoice");
  }

  /**
   * Show element by assigning class 'visible' with visibility: visible and remove class 'hidden'
   * @param {string} selector element selector
   * @private
   */
  _show(selector) {
    const element = document.querySelector(selector);
    if (element || element instanceof HTMLElement) {
      element.classList.remove("hidden");
      element.classList.add("visible");
    } else throw Error("element must be HTMLElement");
  }

  /**
   * Hide element by assigning class 'hidden' with visibility: hidden and remove class 'visible'
   * @param {string} selector element selector
   * @private
   */
  _hide(selector) {
    const element = document.querySelector(selector);
    if (element || element instanceof HTMLElement) {
      element.classList.remove("visible");
      element.classList.add("hidden");
    } else throw Error("element must be HTMLElement");
  }

  /**
   * Enable element by assigning class 'enabled' with display: block and remove class 'disabled'
   * @param {string} selector element selector
   * @private
   */
  _enable(selector) {
    const element = document.querySelector(selector);
    if (element || element instanceof HTMLElement) {
      element.classList.remove("disabled");
      element.classList.add("enabled");
    } else throw Error("element must be HTMLElement");
  }

  /**
   * Disable element by assigning class 'disabled' with display: none and remove class 'enabled'
   * @param {string} selector element selector
   * @private
   */
  _disable(selector) {
    const element = document.querySelector(selector);
    if (element || element instanceof HTMLElement) {
      element.classList.remove("enabled");
      element.classList.add("disabled");
    } else throw Error("element must be HTMLElement");
  }
}
