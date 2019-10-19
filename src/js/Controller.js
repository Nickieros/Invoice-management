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
    window.addEventListener("load", async () => {
      await this.iModel.downloadInvoices()
      .then(() => this.iView.renderPageMain(this.iModel.invoices))
      .then(this.iView.showPageMain);
    });

    window.addEventListener("click", this.onUserAction.bind(this));
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
        this.iView.renderPageAddEditInvoice("Create Invoice", this.iModel.getLastInvoiceNumber() + 1);
        this.iView.showPageAddEditInvoice();
        this.iView.hidePageMain();
        break;

      case "Edit":
        this.iView.showEditInvoice(element);
        this.iView.hidePageMain();
        break;

      case "Remove":
        this.iModel.removeInvoice(this.iView.getRowId(element));
        this.iView.deleteRow(element);
        break;

      case "Save":
        formData = this.iView.getFormData(element);
        if (formData) {
          // make update if formData.number exists in DB or create new invoice
          this.iModel.invoices.forEach(row => {
            if (row.number === formData.number) formData.id = row.id;
          });

          // update invoice
          if (formData.id) {
            this.iModel.updateInvoice(formData)
            .then(() => this.iModel.downloadInvoices())
            .then(() => {
              this.iView.renderPageMain(this.iModel.invoices);
              this.iView.hidePageAddNewInvoice();
              this.iView.showPageMain();
            });
          } else {
            // create new invoice
            formData.id = this.getHash(JSON.stringify(formData));
            this.iModel.addInvoice(formData)
            .then(() => this.iModel.downloadInvoices())
            .then(() => {
              this.iView.renderPageMain(this.iModel.invoices);
              this.iView.hidePageAddNewInvoice();
              this.iView.showPageMain();
            });
          }
        }
        break;

      default:
      }
    }
  }
}
