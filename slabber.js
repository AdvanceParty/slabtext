import fitty from 'fitty';

const CONSTANTS = {
  ratio: 0.6,
  lineLength: 10,
  getLineRatio: function() {
    return this.ratio * this.lineLength;
  }
};

const measureString = el => {
  const text = el.innerText;
  const words = text.split(' ');
  const boxHeight = Math.max(el.offsetHeight, el.offsetWidth * 0.75);
  const lineHeight = el.offsetWidth / CONSTANTS.getLineRatio();
  const lineCount = Math.max(1, Math.floor(boxHeight / lineHeight));
  const charsPerLine = Math.round(text.length / lineCount);

  const info = {
    text,
    words,
    lineHeight,
    lineCount,
    charsPerLine,
    elWidth: el.offsetWidth,
    elHeight: el.offsetHeight,
    constLineRatio: CONSTANTS.getLineRatio()
  };
  console.log(info);

  return { text, words, charsPerLine };
};

const wrapLineTextInHTML = (text, tagName = 'span') => {
  return `<${tagName}>${text}</${tagName}>`;
};

const formatSlab = el => {
  const { words, charsPerLine } = measureString(el);
  console.log(`${words.length} words total`);
  console.log(`${charsPerLine} chars per line.`);
  console.log(CONSTANTS);

  // iterative split lines
  const lines = words.reduce((acc, word) => {
    const currentLine = acc.pop() || '';
    const currentLineExtended = `${currentLine} ${word}`;

    const currentDiff = charsPerLine - currentLine.length;
    const extendedDiff = currentLineExtended.length - charsPerLine;

    //const useExtended = (currentLineExtended.length <= charsPerLine) || (extendedDiff < currentDiff);
    const useExtended = extendedDiff < currentDiff;
    return useExtended
      ? [...acc, currentLineExtended]
      : [...acc, currentLine, word];
  }, []);

  return lines.map(line => wrapLineTextInHTML(line)).join('');
};

export const slab = cssSelector => {
  const slabs = document.querySelectorAll(cssSelector);
  for (var i = 0; i < slabs.length; i++) {
    slabs[i].innerHTML = formatSlab(slabs[i]);
  }
  const fitted = fitty(`${cssSelector} span`);
  fitted.map(fit => {
    fit.element.style.lineHeight = 'calc(.15em * 4.55)';
    fit.element.style.marginBottom = '-.14em';
  });
};
