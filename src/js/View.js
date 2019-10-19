import Utils from "./Utils.js";

/**
 * Class View
 */
export default class extends Utils {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();

    // add dummy panel for animated transition appearance to the main page
    const panelDummy = document.createElement("div");
    panelDummy.className = "panelDummy visible";
    document.body.appendChild(panelDummy);
  }

  /**
   * Add main page to document
   * @param {Array.<{id: string, number: number, date_created: string, date_supplied: string, comment: string}>} invoices invoices Array
   */
  renderPageMain(invoices) {
    const mainPage = document.createElement("div");
    mainPage.className = "page main hidden";

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
    addNewInvoicePage.className = "page addNewInvoice hidden";

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
    Utils.show(".page.main");
    Utils.hide(".panelDummy");
  }

  /**
   * Show page with form for adding a new invoice
   */
  showPageAddNewInvoice() {
    Utils.show(".page.addNewInvoice");
  }

  /**
   * Hide main page
   */
  hidePageMain() {
    Utils.hide(".page.main");
  }

  /**
   * Hide page with form for adding a new invoice
   */
  hidePageAddNewInvoice() {
    Utils.hide(".page.addNewInvoice");
  }
}
