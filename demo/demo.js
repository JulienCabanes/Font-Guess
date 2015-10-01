(function() {
  var fontsFamiliesToFind = [
    '',
    'Fake',
    'Arial, Helvetica, sans-serif',
    'Helvetica, Arial, sans-serif',
    'Helvetica',
    'Consolas, Menlo, Monaco, \'Lucida Console\', \'Liberation Mono\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', \'Courier New\', monospace, sans-serif',
    'Palatino Linotype, Book Antiqua3, Palatino, serif',
    'Tahoma, Geneva, sans-serif',
    'Times New Roman, Times, serif',
    'Times, serif',
    'Comic Sans MS, cursive',
    'Impact, Charcoal, sans-serif'
  ];

  var winAndMacFonts = ['American Typewriter', 'Andale Mono', 'Apple Braille', 'Apple Chancery', 'Arial', 'Arial Unicode MS', 'Athelas', 'Avenir', 'Baskerville MT', 'Big Caslon', 'Bodoni 72', 'Book Antiqua', 'Bradley Hand Bold', 'Brush Script MT', 'Calibri', 'Calisto MT', 'Cambria', 'Candara', 'Century Gothic', 'Chalkboard', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate', 'Copperplate Gothic', 'Corbel', 'Courier', 'Courier New', 'DIN', 'Didot', 'Euphemia UCAS', 'Franklin Gothic Medium', 'Futura', 'Gabriola', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Herculanum', 'Hoefler Text', 'Impact', 'Iowan Old Style', 'Lucida', 'Lucida Grande', 'Lucida Sans Unicode', 'Luminari', 'Marion', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'News Gothic MT', 'Noteworthy', 'Optima', 'PT Fonts', 'Palatino', 'Palatino Linotype', 'Papyrus', 'Phosphate', 'Pilgiche', 'STIX Fonts', 'San Francisco', 'Savoye LET', 'Segoe', 'Seravek', 'SignPainter', 'Skia', 'Snell Roundhand', 'Superclarendon', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Westminster', 'Zapfino'];


  var rows = '';
  fontsFamiliesToFind.forEach(function(fontFamily, index) {
    rows += [
      '<tr>',
        '<td class="font-family">',
          '<input id="font-family-', index, '" type="text" value="', fontFamily, '"/>',
        '</td>',
        '<td class="result" id="result-', index, '" style="font-weight: bold;"></td>',
        '<td class="render" id="render-', index, '">',
          'The five boxing wizards jump quickly',
        '</td>',
      '</tr>'
    ].join('');
  });

  document.getElementById('find-font-table').innerHTML += rows;

  fontsFamiliesToFind.forEach(function(fontFamily, index) {

    var renderEl = document.getElementById('render-' + index);
    var resultEl = document.getElementById('result-' + index);
    var fontFamilyEl = document.getElementById('font-family-' + index);

    runTest();
    fontFamilyEl.addEventListener('keyup', runTest, false);

    function runTest() {
      renderEl.style.fontFamily = fontFamilyEl.value;

      var matchingFontFamily = FontGuess.findUsedFont(renderEl);

      if(matchingFontFamily) {
        resultEl.style.color = 'green';
        resultEl.innerHTML = matchingFontFamily;
      } else {
        resultEl.style.color = 'red';
        resultEl.innerHTML = 'Sorry no match';
      }
    }
  });

  var availableFontsList = document.getElementById('available-fonts-list');
  winAndMacFonts.forEach(function(fontFamily) {
    var item = document.createElement('li');
    item.innerHTML = fontFamily;
    availableFontsList.appendChild(item);

    if(FontGuess.isFontAvailable(fontFamily)) {
      item.className = 'available';
    }
  });
})();
