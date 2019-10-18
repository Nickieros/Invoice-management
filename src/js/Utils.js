/**
 * Class Utils - a class containing utility methods to extend the functionality of other classes
 */
export default class {
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
    hashBuffer += ((hashBuffer + stringValue).split("").reduce((acc, value) => {
      acc ^= value.charCodeAt(0);
      return acc + (acc << 1) + (acc << 4) + (acc << 7) + (acc << 8) + (acc << 24);
    }, 0) >>> 0)
    .toString(16);
    /* eslint-enable no-bitwise */

    return hashBuffer.length < 24 ? this.getHash(stringValue, hashBuffer) : hashBuffer;
    // if the string can contain less than 8 characters, use the code below instead of the previous
    // return (`0000000${(hash >>> 0).toString(16)}`).substr(-8);
  }

  /**
   * Установка свойства в CSS-селекторе.
   * Работает только с первым набором styleSheet, @media
   * @param {string} toCssSelector
   * @param {string} cssProperty
   * @param {string} cssValue
   */
  setCssRule(toCssSelector, cssProperty, cssValue) {
    const css = Array.from(document.styleSheets).find(elem => elem.href);
    const { cssRules } = (css.cssRules || css.rules)[0];

    Object.keys(cssRules).forEach(cssRule => {
      if (cssRules[cssRule].selectorText === toCssSelector) {
        cssRules[cssRule].style.setProperty(cssProperty, cssValue);
      }
    });
  }

  /**
   * Получение свойства из CSS-селектора.
   * Работает только с первым набором styleSheet, @media
   * @param {string} fromCssSelector
   * @param {string} cssProperty
   */
  getCssProperty(fromCssSelector, cssProperty) {
    const css = Array.from(document.styleSheets).find(elem => elem.href);
    const { cssRules } = (css.cssRules || css.rules)[0];
    let propertyValue = "";

    Object.keys(cssRules).forEach(cssRule => {
      if (cssRules[cssRule].selectorText === fromCssSelector) {
        propertyValue = cssRules[cssRule].style.getPropertyValue(cssProperty);
      }
    });
    return propertyValue;
  }

  /**
   * Получение всех правил из CSS-селектора.
   * Работает только с первым набором styleSheet, @media
   * @param {string} fromCssSelector
   */
  getCssRules(fromCssSelector) {
    const css = Array.from(document.styleSheets).find(elem => elem.href);
    const { cssRules } = (css.cssRules || css.rules)[0];
    let propertyValue = "";

    Object.keys(cssRules).forEach(cssRule => {
      if (cssRules[cssRule].selectorText === fromCssSelector) {
        propertyValue = cssRules[cssRule].style.cssText;
      }
    });
    return propertyValue;
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
    return (
      value
      && typeof value === "object"
      && value.constructor.toString() === Array.toString()
    );
  }

  /**
   * Returns true if value type is Object
   * @param {Object} value
   * @returns {boolean}
   */
  isObject(value) {
    return value && typeof value === "object" && value.constructor === Object;
  }
}
