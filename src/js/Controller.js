import Utils  from "./Utils.js";
import Model  from "./Model.js";
import View   from "./View.js";

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
      .then(() => this.iView.renderMainPage(this.iModel.invoices));
    });
  }
}
