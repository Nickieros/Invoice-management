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
      await this.iModel
      .downloadInvoices()
      .then(() => this.iView.renderMainPage(this.iModel.invoices));
    });

    window.addEventListener("click", this.onUserAction.bind(this));
  }

  /**
   * Handling user actions
   * @param {Event} event
   */
  onUserAction(event) {
    const element = event.target;
    if (element.tagName === "INPUT" && element.type === "button") {
      switch (element.value) {
      case "Remove":
        // eslint-disable-next-line no-case-declarations
        const row = element.closest(".tableRow");
        this.iModel.removeInvoice(row.id);
        row.parentElement.removeChild(row);
        break;

      case "Add new":

        break;

      default:
      }
    }
  }
}
// getLastInvoiceNumber
