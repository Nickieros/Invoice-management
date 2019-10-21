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
     * Add new invoice to local and remote data storage
     * @param invoice
     * @returns {Promise<void>}
     */
    async addInvoice(invoice) {
        this.invoices.push(invoice);

        await fetch(`${this.DATA_SOURCE_NAME}/invoices`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            mode: "cors",
            body: JSON.stringify(invoice),
        })
            .then(response => this.validateResponse(response))
            .catch(error => console.error("Model -> removeInvoice: ", error.message));
    }

    /**
     * Download invoices as array
     * @returns {Promise.<Array.<{id: string, number: number, date_created: string, date_supplied: string, comment: string}>>} invoices
     */
    async downloadInvoices() {
        await fetch(`${this.DATA_SOURCE_NAME}/invoices?_sort=date_created&_order=desc`, {
            headers: { "Content-Type": "application/x-www-form-urlencoded;" },
            method: "GET",
            mode: "cors",
        })
            .then(response => !this.validateResponse(response) || response.json())
            .then(json => {
                this.invoices = Object.values(JSON.parse(JSON.stringify(json)));
            })
            .then(() => {
                // invoices validation
                if (!this.isArray(this.invoices)) {
                    throw Error("View -> renderMainPage: invoices must be an Array");
                }
                if (
                    !this.invoices.every(row => {
                        // eslint-disable-next-line no-underscore-dangle
                        const iId = row.id;
                        const iNumber = row.number;
                        const iDateCreated = row.date_created;
                        const iDateSupplied = row.date_supplied;
                        return (
                            iId &&
                            iNumber &&
                            iDateCreated &&
                            iDateSupplied &&
                            this.isString(iId) &&
                            this.isNumber(iNumber) &&
                            this.isString(iDateCreated) &&
                            this.isString(iDateSupplied)
                        );
                    })
                ) {
                    throw Error(
                        "Model -> downloadInvoices: " +
                            "objects in invoices must have following properties and their types: " +
                            "{id: string, number: number, date_created: string, date_supplied: string}"
                    );
                }
            })
            .catch(error => console.error("Model -> downloadInvoices: ", error.message));
    }

    /**
     * Returns last invoice number
     * Increased by 1, it will be offered to User as new invoice number in "Add New Invoice" page
     * @returns {string} lastInvoiceNumber
     */
    getLastInvoiceNumber() {
        if (!this.invoices.length) {
            console.error("invoices is absent or not downloaded yet");
            return 0;
        }

        let lastInvoiceNumber = 0;

        // search biggest number
        this.invoices.forEach(row => {
            if (lastInvoiceNumber < row.number) lastInvoiceNumber = row.number;
        });

        return lastInvoiceNumber;
    }

    /**
     * Delete invoice with given id from local invoices Array and from remote DB
     * @param invoiceId
     * @returns {Promise<void>}
     */
    async removeInvoice(invoiceId) {
        let invoiceArrayIndex = "";

        // find array index to remove element
        this.invoices.forEach((row, index) => {
            if (row.id === invoiceId) invoiceArrayIndex = index;
        });

        // remove element from local data storage
        this.invoices.splice(invoiceArrayIndex, 1);

        // remove element from remote data storage
        await fetch(`${this.DATA_SOURCE_NAME}/invoices/${invoiceId}`, {
            headers: { "Content-Type": "application/json" },
            method: "DELETE",
            mode: "cors",
        })
            .then(response => this.validateResponse(response))
            .catch(error => console.error("Model -> removeInvoice: ", error.message));
    }

    /**
     * Update invoice in remote data storage and refresh local
     * @param invoice
     * @returns {Promise<void>}
     */
    async updateInvoice(invoice) {
        await fetch(`${this.DATA_SOURCE_NAME}/invoices/${invoice.id}`, {
            headers: { "Content-Type": "application/json" },
            // use the PATCH method to optimize interaction with resource,
            // cos it can updates part of resource instead of the PUT method,
            // which updates the entire resource :-o
            method: "PUT",
            mode: "cors",
            body: JSON.stringify(invoice),
        })
            .then(response => this.validateResponse(response))
            .catch(error => console.error("Model -> updateInvoice: ", error.message));

        // refresh local data storage
        this.downloadInvoices();
    }
}
