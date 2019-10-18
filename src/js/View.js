import Utils from "./Utils.js";

/**
 * Class View
 */
export default class extends Utils {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  renderMainPage(invoices) {
    // invoices validation
    if (!this.isArray(invoices)) throw Error("View -> renderMainPage: invoices must be an Array");
    if (!invoices.every(row => {
      // eslint-disable-next-line no-underscore-dangle
      const iId = row._id;
      const iNumber = row.number;
      const iDateCreated = row.date_created;
      const iDateSupplied = row.date_supplied;
      return iId
        && iNumber
        && iDateCreated
        && iDateSupplied
        && this.isString(iId)
        && this.isNumber(iNumber)
        && this.isString(iDateCreated)
        && this.isString(iDateSupplied);
    })) {
      throw Error(`View -> renderMainPage: objects in invoices must have following properties and their types:
        {_id: string, number: number, date_created: string, date_supplied: string, comment: string}`);
    }

    const content = document.createElement("div");
    let htmlBuffer = "";

    content.classList.add("content");

    htmlBuffer = `
    <div class="header">
        <p>Invoices</p>
    </div>
    <div class="actions panel">
        <p class="section">Actions</p>
        <div class="buttons"><input type="button" value="Add new"></div>
    </div>
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

    for (let i = 0; i < invoices.length; i++) {
      htmlBuffer += `
            <div class="tableRow">
                <div data-header="Create:&nbsp;">${invoices[i].date_created}</div>
                <div data-header="No:&nbsp;">INV-${invoices[i].number}</div>
                <div data-header="Supply:&nbsp;">${invoices[i].date_supplied}</div>
                <div data-header="Comment:&nbsp;">${invoices[i].comment}</div>
                <div data-header="Actions:&nbsp;" class="buttons">
                    <input type="button" value="Edit">
                    <input type="button" value="Remove">
                </div>
            </div>`;
    }

    htmlBuffer += `
          </div>
      </div>`;

    content.innerHTML = htmlBuffer;
    document.body.appendChild(content);
  }
}
