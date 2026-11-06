//słownik można dodawać słowa
const dictionary = [
    { target: /\btak\b/gi, replacement: "tak rell" },
    { target: /\bnie\b/gi, replacement: "witam chyba nie" },
    { target: /\bdobrze\b/gi, replacement: "ok, spk" },
    { target: /\bnowy mikronauta\b/gi, replacement: "noffy" },
    { target: /\bdziecko\b/gi, replacement: "noffy" },
    { target: /\bstarszy mikronauta\b/gi, replacement: "sstarry" },
    { target: /\bstaruszek\b/gi, replacement: "sstarry" },
    { target: /\bzrozumiano\b/gi, replacement: "już rozumiem" },
    { target: /\bkurwa\b/gi, replacement: "kurffa" },
    { target: /\bkurwie\b/gi, replacement: "kurffie" },
    { target: /\bprofesor\b/gi, replacement: "pssor" },
    { target: /\bprofesorem\b/gi, replacement: "pssorem" },
];

const processedNodes = new WeakSet();

const applyDictionary = (inputText) =>
    dictionary.reduce(
        (currentText, rule) => currentText.replace(rule.target, rule.replacement),
        inputText,
    );

//zamiana liter s i w
const replaceLetters = (inputText) =>
    inputText
        .replace(/(^|[^sS])s(?![sS])/g, "$1ss")
        .replace(/(^|[^sS])S(?![sS])/g, "$1SS")
        .replace(/(^|[^fF])w(?![fF])/g, "$1ff")
        .replace(/(^|[^fF])W(?![fF])/g, "$1FF");

const modifySentence = (sentenceText, sentenceIndex) => {
    let resultText = sentenceText;

    if (sentenceIndex % 3 === 0) {
        const leadSpace = resultText.match(/^\s*/)?.[0] || "";
        const trimmedText = resultText.trimStart();
        resultText = leadSpace + "ff tym " + trimmedText;
    }

    if (sentenceIndex % 8 === 0) {
        resultText = resultText.replace(/([.!?]+)(\s*)$/, " tak poffiem.$1$2");
    }

    if (sentenceIndex % 10 === 0) {
        resultText = resultText.replace(/([.!?]+)(\s*)$/, " Tak ffam poffiem.$1$2");
    }

    if (sentenceIndex % 6 === 0) {
        resultText = resultText.replace(/([.!?]+)(\s*)$/, " BRAFFO ZULU$1$2");
    }

    return resultText;
};

const processSentences = (inputText) => {
    let sentenceCount = 0;
    return inputText.replace(/([^.!?]+[.!?]+)/g, (matchSentence) => {
        sentenceCount++;
        return modifySentence(matchSentence, sentenceCount);
    });
};

const skipWords = ["no", "tzw", "ff", "tym", "tzff"];

const insertWords = (inputText) =>
    inputText
        .split(/\s+/)
        .map((wordText, wordIndex) => {
            if (
                !wordText ||
                wordIndex === 0 ||
                wordText.startsWith("<") ||
                skipWords.includes(wordText.toLowerCase())
            ) {
                return wordText;
            }

            let prefixText = "";
            if (wordIndex % 4 === 0) prefixText += "no ";
            if (wordIndex % 11 === 0) prefixText += "tzw ";
            if (wordIndex % 14 === 0) prefixText += "ff tym ";

            return prefixText ? prefixText + wordText : wordText;
        })
        .filter(Boolean)
        .join(" ");

const translateText = (inputText) => {
    if (!inputText || !inputText.trim()) return inputText;

    const afterDictionary = applyDictionary(inputText);
    const afterLetters = replaceLetters(afterDictionary);
    const afterSentences = processSentences(afterLetters);
    return insertWords(afterSentences);
};

//tego lepiej nie ruszać bo coś wyjebie
const ignoredTags = ["SCRIPT", "STYLE", "TEXTAREA", "INPUT"];

const isInsideEditable = (textNode) => {
    const parentEl = textNode.parentElement;
    return !!parentEl && parentEl.isContentEditable;
};

const translateNode = (currentNode) => {
    if (processedNodes.has(currentNode)) return;

    if (currentNode.nodeType === 1) {
        if (ignoredTags.includes(currentNode.tagName)) return;
        if (currentNode.isContentEditable) return;
        Array.from(currentNode.childNodes).forEach((childNode) =>
            translateNode(childNode),
        );
    }

    if (currentNode.nodeType === 3 && currentNode.nodeValue) {
        if (!currentNode.nodeValue.trim()) return;
        if (isInsideEditable(currentNode)) return;

        const newText = translateText(currentNode.nodeValue);
        if (currentNode.nodeValue !== newText) {
            currentNode.nodeValue = newText;
            processedNodes.add(currentNode);
        }
    }
};

const startTranslation = (targetElement) => {
    translateNode(targetElement);

    //spierdolony observer jak umiesz lepiej to popraw
    const pageObserver = new MutationObserver((mutationList) => {
        mutationList.forEach((singleMutation) => {
            singleMutation.addedNodes.forEach((addedNode) => {
                translateNode(addedNode);
            });
        });
    });

    pageObserver.observe(targetElement, { childList: true, subtree: true });
};

startTranslation(document.body);