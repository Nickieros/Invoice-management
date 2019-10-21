/**
 * Class Utils - a class containing utility methods to extend the functionality of other classes
 */
export default class {
    /**
     * Show element by assigning class 'visible' with visibility: visible and remove class 'hidden'
     * @param {string} selector element selector
     */
    static show(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.remove("hidden");
            element.classList.add("visible");
        }
    }

    /**
     * Hide element by assigning class 'hidden' with visibility: hidden and remove class 'visible'
     * @param {string} selector element selector
     */
    static hide(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.remove("visible");
            element.classList.add("hidden");
        }
    }

    /**
     * Delete HTMLElement with a given selector
     * @param {string} selector element selector
     */
    static deleteElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.parentElement.removeChild(element);
    }

    /**
     * Enable element by assigning class 'enabled' with display: block and remove class 'disabled'
     * @param {string} selector element selector
     */
    static enable(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.remove("disabled");
            element.classList.add("enabled");
        }
    }

    /**
     * Disable element by assigning class 'disabled' with display: none and remove class 'enabled'
     * @param {string} selector element selector
     */
    static disable(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.remove("enabled");
            element.classList.add("disabled");
        }
    }

    /**
     * Returns 96-bit hash from a given string value
     * Based on FNV hash algorithm. Also, for use in test assignment from Akvelon, alternatives are 96Crypt and CRC-ZIP encryption algorithms
     * @param {string} stringValue a string to be hashed
     * @param {string} [hashBuffer] in-recursion-use-only parameter, like accumulator in reduce, must be filled to 24 characters.
     * Each recursion iteration adds to hashBuffer 8 characters (32 bit)
     * @returns {string} hex
     * @see https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function FNV hash algorithm
     */
    getHash(stringValue, hashBuffer = "") {
        /* eslint-disable no-bitwise */
        hashBuffer += (
            (hashBuffer + stringValue).split("").reduce((acc, value) => {
                acc ^= value.charCodeAt(0);
                return acc + (acc << 1) + (acc << 4) + (acc << 7) + (acc << 8) + (acc << 24);
            }, 0) >>> 0
        ).toString(16);
        /* eslint-enable no-bitwise */

        return hashBuffer.length < 24 ? this.getHash(stringValue, hashBuffer) : hashBuffer;
        // if the string can contain less than 8 characters, use the code below instead of the previous
        // return (`0000000${(hash >>> 0).toString(16)}`).substr(-8);
    }

    /**
     * Returns true if value type is String
     * @param {string} value
     * @returns {boolean}
     */
    isString(value) {
        return typeof value === "string" || value instanceof String;
    }

    /**
     * Returns true if value type is real(finite) Number
     * @param {number} value
     * @returns {boolean}
     */
    isNumber(value) {
        return typeof value === "number" && Number.isFinite(value);
    }

    /**
     * Returns true if value type is Array
     * @param {Array} value
     * @returns {boolean}
     */
    isArray(value) {
        return value && typeof value === "object" && value.constructor.toString() === Array.toString();
    }

    /**
     * Returns true if value type is Object
     * @param {Object} value
     * @returns {boolean}
     */
    isObject(value) {
        return value && typeof value === "object" && value.constructor === Object;
    }

    /**
     * Returns true if value type can convert to date
     * @param {string} value
     * @returns {boolean}
     */
    isDate(value) {
        return !!Date.parse(value);
    }

    /**
     * Validate fetch response from the server. Returns true if validation is successful, else throw error
     * @param {Response} response fetch response from server
     */
    validateResponse(response) {
        if (!response.ok) {
            // Client (400-500) and server (500-600) errors responses
            throw Error(
                `_validateResponse() found client error: ${response.status} ${response.statusText} when fetching ${response.url}`
            );
        }
        return true;
    }
}
