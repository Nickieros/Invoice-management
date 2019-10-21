import Utils from "./Utils.js";
import Model from "./Model.js";
import View from "./View.js";

/**
 * Class Controller
 */
export default class extends Utils {
    /**
     * Constructor
     */
    constructor() {
        super();

        /**
         * @type {Model}
         */
        this.iModel = new Model();

        /**
         * @type {View}
         */
        this.iView = new View();

        this._addEventListeners();
    }

    /**
     * Event listener aggregator
     * @private
     */
    _addEventListeners() {
        window.addEventListener("load", () => {
            this.iModel.downloadInvoices().then(() => this.iView.showPageMain(this.iModel.invoices));
        });

        window.addEventListener("click", this.onUserAction.bind(this));

        window.addEventListener("submit", this.onUserAction.bind(this));
    }

    /**
     * Handling user actions
     * @param {Event} event
     */
    onUserAction(event) {
        const element = event.target;
        let formData = {};

        if (element.tagName === "INPUT" && element.type === "button") {
            switch (element.dataset.action) {
                case "Add new":
                    document.body.scrollIntoView({
                        behavior: "auto",
                        block: "start",
                    });
                    this.iView.showPageAddNewInvoice(this.iModel.getLastInvoiceNumber() + 1);
                    break;

                case "Edit":
                    document.body.scrollIntoView({
                        behavior: "auto",
                        block: "start",
                    });
                    this.iView.showPageEditInvoice(
                        this.iModel.invoices.filter(row => row.id === this.iView.getRowId(element))[0]
                    );
                    break;

                case "Remove":
                    // don't use await cos stop don't needed, let it works in background
                    this.iModel.removeInvoice(this.iView.getRowId(element));
                    this.iView.deleteRow(element);
                    break;

                case "Save":
                    formData = this.iView.getFormData(element);
                    if (formData) {
                        document.body.scrollIntoView({
                            behavior: "auto",
                            block: "start",
                        });

                        // make update if formData.number exists in DB or create new invoice
                        this.iModel.invoices.forEach(row => {
                            if (row.number === formData.number) {
                                formData.id = row.id;
                            }
                        });

                        // update invoice
                        if (formData.id) {
                            this.iModel
                                .updateInvoice(formData)
                                .then(() => this.iModel.downloadInvoices())
                                .then(() => this.iView.showPageMain(this.iModel.invoices));
                        } else {
                            // create new invoice
                            formData.id = this.getHash(JSON.stringify(formData));
                            this.iModel
                                .addInvoice(formData)
                                .then(() => this.iModel.downloadInvoices())
                                .then(() => this.iView.showPageMain(this.iModel.invoices));
                        }

                        this.iView.showPageMain(this.iModel.invoices);
                    }
                    break;

                default:
            }
        }

        if (event.type === "submit") {
            document.querySelector(".addEditInvoice-form__input__saveButton").click();
        }
    }
}
