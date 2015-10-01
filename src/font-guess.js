module.exports = {
  // Main API functions
  findUsedFont: findUsedFont,
  isFontAvailable: isFontAvailable,

  // Internal helpers exposed
  createTestElement: createTestElement,
  getMultipleSizes: getMultipleSizes,
  getElementFontFamily: getElementFontFamily,
  checkFontSubstitution: checkFontSubstitution,
  getDefaultFontFamily: getDefaultFontFamily,
  getDefaultFontFamilyOpposite: getDefaultFontFamilyOpposite,
  isEqual: isEqual,
  hasSameName: hasSameName
};

/**
 * Find the font used for rendering an element
 * @param  {DOMElement} element
 * @return {string}
 */
function findUsedFont(element) {
  var fontFamily = getElementFontFamily(element);
  var originalFontFamily = fontFamily;
  var fontFamilies;
  var matchingFontFamily;

  // Add default font-family as a fallback
  fontFamily = getDefaultFontFamily() + ', ' + fontFamily;
  fontFamilies = fontFamily.split(',');

  fontFamilies.forEach(function(singleFontFamily) {
    // Take the first match only
    if (!matchingFontFamily && isEqual(originalFontFamily, singleFontFamily)) {
      matchingFontFamily = singleFontFamily;
    }
  });

  // Check if substituted
  matchingFontFamily = checkFontSubstitution(matchingFontFamily);

  return matchingFontFamily;
}

/**
 * Find if a font is available in the browser or not
 * @param  {string}  fontFamily
 * @return {boolean}
 */
function isFontAvailable(fontFamily) {
  var defaultFontFamily = getDefaultFontFamily();

  // First add the single quotes, even if not necessary
  fontFamily = '\'' + fontFamily.replace(/'/g, '') + '\'';

  // Substituted fonts are considered false
  if (!hasSameName(fontFamily, checkFontSubstitution(fontFamily))) {
    return false;
  }

  // Then check if the font is equivalent to serif or sans-serif
  // We do this because otherwise, we couldn't trust the fallback on the final step
  var isSerif = isEqual(fontFamily + ', sans-serif', 'serif');
  var isSansSerif = isEqual(fontFamily + ', serif', 'sans-serif');

  // Another use case is when the default font is overriden
  // then it's either serif nor sans-serif, we just need to test it by name
  var isDefaultFont = hasSameName(fontFamily, defaultFontFamily);

  if (isSerif || isSansSerif || isDefaultFont) {
    return true;
  }

  // Finally we can compare with the default font (which is serif or sans-serif)
  var isAvailable = !isEqual(fontFamily, defaultFontFamily);

  return isAvailable;
}

/**
 * Every characters used for rendering comparaison
 * @return {string}
 */
function getTestCharacters() {
  var testString = '';
  testString += 'abcdefghijklmnopqrstuvwxyz';
  testString += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  testString += '01234567890';
  testString += '@#&é\'(§è!çà)°-_^¨$*`£ù%=+:/;.,?';
  testString += '•ë‘{¶«¡Çø}—€ôÙ@≠÷…∞';
  return testString;
}

/**
 * Creates a temporary element with some useful context and styles
 * @param  {string} fontFamily
 * @return {DOMElement}
 */
function createTestElement(fontFamily) {
  var parentEl = document.createElement('div');
  var testEl = document.createElement('div');

  // Parent is necessary to prevent scrollbars
  parentEl.style.position = 'absolute';
  parentEl.style.overflow = 'auto';
  parentEl.style.visibility = 'hidden';

  testEl.style.fontFamily = fontFamily;
  testEl.style.display = 'inline';
  testEl.style.visibility = 'hidden';

  // The size should be big enough to make a visual difference
  testEl.style.fontSize = '100px';

  // Reset and prevent line breaks
  testEl.style.fontWeight = 'normal';
  testEl.style.fontStyle = 'normal';
  testEl.style.letterSpacing = 'normal';
  testEl.style.lineHeight = 'normal';
  testEl.style.whiteSpace = 'nowrap';

  parentEl.appendChild(testEl);
  document.body.appendChild(parentEl);

  return testEl;
}

/**
 * Inject test characters inside a tester element and get the total offset size
 * Fastest method but not safe because +1 -1 = 0
 * @param  {string} fontFamily
 * @return {string}
 */
function getSingleSize(fontFamily) {
  var testEl = createTestElement(fontFamily);
  var testString = getTestCharacters();
  var size = '';

  testEl.innerHTML = testString;
  size = testEl.offsetWidth + 'x' + testEl.offsetHeight;
  document.body.removeChild(testEl.parentElement);

  return size;
}

/**
 * Inject test characters one by one and concatenate each offset size
 * Safest method because each character size counts but very slow
 * @param  {[type]} fontFamily
 * @return {[type]}
 */
function getMultipleSizes(fontFamily) {
  var testEl = createTestElement(fontFamily);
  var testString = getTestCharacters();
  var sizes = '';

  for (var i = 0; i < testString.length; i++) {
    testEl.innerHTML = testString[i];
    sizes += testEl.offsetWidth + 'x' + testEl.offsetHeight + '|';
  }
  document.body.removeChild(testEl.parentElement);

  return sizes;
}

/**
 * getComputedStyle helper
 * @param  {DOMElement} element
 * @return {string}
 */
function getElementFontFamily(element) {
  var fontFamily = window.getComputedStyle(element, null)
    .getPropertyValue('font-family');
  return fontFamily;
}

/**
 * Check if the font is substituted like Helvetica with Arial on Windows
 * For now only test for Helvetica and Times, have to find a better way
 * @param  {string} fontFamily
 * @return {string}
 */
function checkFontSubstitution(fontFamily) {
  if (fontFamily.match(/helvetica/gi) && isEqual(fontFamily, 'arial')) {
    return 'Arial';
  }

  if (fontFamily.match(/times/gi) && isEqual(fontFamily, 'Times New Roman')) {
    return 'Times New Roman';
  }

  return fontFamily;
}

/**
 * Find the default user agent font-family
 * The best way to find it is to use an iframe because only UA's stylesheet apply
 * @return {string}
 */
function getDefaultFontFamily() {
  var iframe = document.createElement('iframe');
  var htmlElement;
  var fontFamily;

  document.body.appendChild(iframe);
  htmlElement = iframe.contentDocument.documentElement;
  fontFamily = getElementFontFamily(htmlElement);
  document.body.removeChild(iframe);

  return fontFamily;
}

/**
 * Find the default font-family "opposite"
 * If the default font is equivalent to serif, the opposite is sans-serif
 * @return {string}
 */
function getDefaultFontFamilyOpposite() {
  var defaultFontFamily = getDefaultFontFamily();
  var oppositeFontFamily = isEqual(defaultFontFamily, 'serif') ? 'sans-serif' : 'serif';

  return oppositeFontFamily;
}

/**
 * Compare two font-family by size
 * @param  {string}  fontFamilyA
 * @param  {string}  fontFamilyB
 * @return {boolean}
 */
function isEqual(fontFamilyA, fontFamilyB) {
  return getSingleSize(fontFamilyA) === getSingleSize(fontFamilyB);
}

/**
 * Compare two font-family by name
 * @param  {string}  fontFamilyA
 * @param  {string}  fontFamilyB
 * @return {boolean}
 */
function hasSameName(fontFamilyA, fontFamilyB) {
  fontFamilyA = fontFamilyA.replace(/'/g, '');
  fontFamilyA = fontFamilyA.toLowerCase();

  fontFamilyB = fontFamilyB.replace(/'/g, '');
  fontFamilyB = fontFamilyB.toLowerCase();

  return fontFamilyA === fontFamilyB;
}
