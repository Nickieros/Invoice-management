import Utils from "./Utils.js";

/**
 * Class View
 */
export default class extends Utils {
    constructor() {
        super();

        // add dummy panel for animated transition appearance to the main page
        const panelDummy = document.createElement("div");
        panelDummy.className = "panelDummy visible";
        document.body.appendChild(panelDummy);
    }

    /**
     * Deletes row of the given element
     * @param {HTMLElement} element HTMLElement in css-table row
     */
    deleteRow(element) {
        const row = document.getElementById(this.getRowId(element));
        if (row) {
            row.classList.add("hidden");
            row.style.fontSize = "0";
            setTimeout(() => row.parentElement.removeChild(row), 2000);
        }
    }

    /**
     * Validates form data and returns it as object
     * @param {HTMLElement} element HTMLElement - usually its a button in form area
     * @returns {boolean|{number: number, date_created: string, date_supplied: string, comment: string}}
     */
    getFormData(element) {
        const HTMLForm = element.closest("form");
        const errorMessageElement = document.querySelector(".addEditInvoice-form__message__error");

        const invoiceNumber = parseInt(HTMLForm.number.value);
        if (this.isNumber(invoiceNumber) && invoiceNumber > 0 && invoiceNumber < 1000000) {
            HTMLForm.number.classList.remove("error-input");
        } else {
            HTMLForm.number.classList.add("error-input");
            errorMessageElement.innerHTML = "invalid number field: natural number up to 999 999 was expected";
            return false;
        }

        const invoiceDate = HTMLForm.invoiceDate.value;
        if (Date.parse(invoiceDate)) {
            HTMLForm.invoiceDate.classList.remove("error-input");
        } else {
            HTMLForm.invoiceDate.classList.add("error-input");
            errorMessageElement.innerHTML = "invoice date is invalid. Format: YYYY-MM-DD";
            return false;
        }

        const supplyDate = HTMLForm.supplyDate.value;
        if (Date.parse(supplyDate)) {
            HTMLForm.supplyDate.classList.remove("error-input");
        } else {
            HTMLForm.supplyDate.classList.add("error-input");
            errorMessageElement.innerHTML = "supply date is invalid. Format: YYYY-MM-DD";
            return false;
        }

        const commentTxt = HTMLForm.comment.value;
        if (commentTxt.length < 160) {
            HTMLForm.comment.classList.remove("error-input");
        } else {
            HTMLForm.comment.classList.add("error-input");
            errorMessageElement.innerHTML = "сomment length must be less than 160 characters";
            return false;
        }

        return {
            number: invoiceNumber,
            date_created: invoiceDate,
            date_supplied: supplyDate,
            comment: commentTxt,
        };
    }

    /**
     * Returns row id of element or throws error
     * @param {HTMLElement|EventTarget} element EventTarget or HTMLElement in css-table row
     * @returns {string}
     */
    getRowId(element) {
        const rowElement = element.closest(".tableRow");
        if (!rowElement) {
            throw Error(
                `View -> getRowId: element '${element.tagName} ${element.type} "${element.value}"' has no parent node with ".tableRow" selector`
            );
        }
        return rowElement.id;
    }

    /**
     * Show page with form for adding a new invoice
     * @param {number} invoiceNumber invoice number
     */
    showPageAddNewInvoice(invoiceNumber) {
        this._renderPageAddEditInvoice("Create Invoice", invoiceNumber);
        Utils.show(".page.addEditInvoice");
        Utils.hide(".page.main");
    }

    /**
     * Gets invoice data, render the "Edit invoice" page and shows it with filled invoice information
     * @param {{id: string, number: number, date_created: string, date_supplied: string, comment: string}} invoice invoice object
     */
    showPageEditInvoice(invoice) {
        this._renderPageAddEditInvoice(
            "Edit Invoice",
            invoice.number,
            invoice.date_created,
            invoice.date_supplied,
            invoice.comment
        );

        Utils.show(".page.addEditInvoice");
        Utils.hide(".page.main");
    }

    /**
     * Shows main page
     * @param {Array.<{id: string, number: number, date_created: string, date_supplied: string, comment: string}>} invoices invoices as objects Array
     */
    showPageMain(invoices) {
        this._renderPageMain(invoices);
        Utils.show(".page.main");
        Utils.hide(".panelDummy");
        Utils.hide(".page.addEditInvoice");
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
                    <input type="button" value="Add new" data-action="Add new">
                </div>
            </div>`;
    }

    /**
     * Returns HTML code of the add new invoice form panel div element
     * @param {number} invoiceNumber invoice number
     * @param {string} invoiceDate invoice date
     * @param {string} supplyDate supply date
     * @param {string} comment comment
     * @returns {string} htmlDiv HTML code of the add new invoice form panel div element
     * @private
     */
    _createHtmlAddEditInvoiceFormPanel(invoiceNumber, invoiceDate, supplyDate, comment) {
        // prettier-ignore
        /* eslint-disable no-useless-escape */
        return `
        <div class="panel addEditInvoiceForm">
            <form class="addEditInvoice-form" onsubmit="return false;">
                <div class="addEditInvoice-form__wrapper">
                    <div class="addEditInvoice-form__wrapper__number">
                        <label>Number:<br>
                        <div class="addEditInvoice-form__input__invoiceNumber__prefix">INV-</div>
                        <input
                                tabindex="1"
                                type="number"
                                name="number"
                                value="${ invoiceNumber }"
                                min="1"
                                max="999999"
                                required
                                class="addEditInvoice-form__input__invoiceNumber"/>
                        <div class="addEditInvoice-form__input__explanation">* natural number<br>up to 999 999</div>
                        </label>
                    </div>
                    <div class="addEditInvoice-form__wrapper__invoiceDate">
                        <label>Invoice Date:<br>
                            <input
                                    tabindex="2"
                                    type="date"
                                    name="invoiceDate"
                                    placeholder="${ invoiceDate || "select date"}"
                                    value="${ invoiceDate }"
                                    required 
                                    pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                                    class="addEditInvoice-form__input__invoiceDate">
                        </label>
                    </div>
                    <div class="addEditInvoice-form__wrapper__supplyDate">
                        <label>Supply Date:<br>
                        <input
                                tabindex="3"
                                type="date"
                                name="supplyDate"
                                placeholder="${ supplyDate || "select date"}"
                                value="${ supplyDate }"
                                required 
                                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                                class="addEditInvoice-form__input__supplyDate"/>
                        </label>
                    </div>
                    <div class="addEditInvoice-form__wrapper__comment flex-break">
                        <label>Comment:<br>
                        <textarea
                                tabindex="4"
                                name="comment"
                                class="addEditInvoice-form__input__comment"
                                rows="2"
                                placeholder="add comment here">${ comment }</textarea><br>
                        <span class="addEditInvoice-form__input__explanation">* сomment length must be no more than 160 characters</span></label>
                    </div>
                </div>
                <div class="addEditInvoice-form__message__error"></div>
                <input tabindex="5" type="button" name="Save" value="Save" data-action="Save" class="addEditInvoice-form__input__saveButton">
            </form>
        </div>`;
        /* eslint-enable no-useless-escape */
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
            // prettier-ignore
            htmlBuffer += `
                <div class="tableRow" id="${ invoicesArray[i].id }">
                    <div data-header="Create:&nbsp;">
                        ${ invoicesArray[i].date_created }
                    </div>
                    <div data-header="No:&nbsp;">
                        INV-${ this._formatInvoiceNumber(invoicesArray[i].number) }
                    </div>
                    <div data-header="Supply:&nbsp;">
                        ${ invoicesArray[i].date_supplied }
                    </div>
                    <div data-header="Comment:&nbsp;">
                        ${ invoicesArray[i].comment === undefined ? "" : invoicesArray[i].comment }
                    </div>
                    <div data-header="Actions:&nbsp;" class="buttons">
                        <input
                                type="button"
                                value="Edit"
                                data-action="Edit" />
                        <input
                                type="button"
                                value="Remove"
                                data-action="Remove"/>
                    </div>
                </div>
            `;
        }

        htmlBuffer += `
        </div>
      </div>`;

        return htmlBuffer;
    }

    /**
     * Format invoice number to template "INV-XXXXXX" with fixed length of digital part
     * @param {number} invoiceNumber invoice number
     * @returns {string} formattedInvoiceNumber formatted invoice number
     */
    _formatInvoiceNumber(invoiceNumber) {
        // eslint-disable-next-line no-bitwise
        return `INV-000000${invoiceNumber >>> 0}`.substr(-6);
    }

    /**
     * Hide page with form for adding a new invoice
     * @private
     */
    _hidePageAddNewInvoice() {
        Utils.hide(".page.addEditInvoice");
    }

    /**
     * Hide page with form for editing invoice
     * @private
     */
    _hidePageEditInvoice() {
        this._hidePageAddNewInvoice();
    }

    /**
     * Hide main page
     * @private
     */
    _hidePageMain() {
        Utils.hide(".page.main");
    }

    /**
     * Add to document a page with a form for adding a new invoice or editing invoice
     * @param {string} header header text of page
     * @param {string} invoiceDate invoice date
     * @param {string} supplyDate supply date
     * @param {string} comment comment
     * @param {number} invoiceNumber - invoice number
     */
    _renderPageAddEditInvoice(header, invoiceNumber, invoiceDate = "", supplyDate = "", comment = "") {
        // delete old page
        Utils.deleteElement(".page.addEditInvoice");

        const addEditInvoicePage = document.createElement("div");

        addEditInvoicePage.className = "page addEditInvoice hidden";

        // prettier-ignore
        addEditInvoicePage.innerHTML = `
            ${ this._createHtmlHeader(header) }
            ${ this._createHtmlAddEditInvoiceFormPanel(invoiceNumber, invoiceDate, supplyDate, comment) }`;

        document.body.appendChild(addEditInvoicePage);
    }

    /**
     * Adds main page to document
     * @param {Array.<{id: string, number: number, date_created: string, date_supplied: string, comment: string}>} invoices invoices as objects Array
     * @private
     */
    _renderPageMain(invoices) {
        // delete old page
        Utils.deleteElement(".page.main");

        const mainPage = document.createElement("div");
        mainPage.className = "page main hidden";

        // prettier-ignore
        mainPage.innerHTML = `
            ${ this._createHtmlHeader("Invoices") }
            ${ this._createHtmlActionsPanel() }
            ${ this._createHtmlInvoicesPanel(invoices) }`;

        document.body.appendChild(mainPage);
    }
}
