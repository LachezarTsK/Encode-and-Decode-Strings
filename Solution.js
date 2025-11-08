
/**
 * @param {string[]} messageChunks
 * @return {string}
 */
var encode = function (messageChunks) {
    let shiftsForCharacter = 0;
    const encodedMessage = new Array();
    const sizePerMessageChunk = new Array();

    for (let current of messageChunks) {
        for (let i = 0; i < current.length; ++i) {
            const encoded = shiftRight(current.codePointAt(i), shiftsForCharacter);
            encodedMessage.push(encoded);
            shiftsForCharacter = (shiftsForCharacter + 1) % Util.SIZE_EXTENDED_ASCII;
        }

        sizePerMessageChunk.push((current.length).toString());
        sizePerMessageChunk.push(Util.DELIMITER_CHUNK_SIZE);
    }

    sizePerMessageChunk.reverse();
    encodedMessage.push(...sizePerMessageChunk);

    return encodedMessage.join('');
};

/**
 * @param {string} encodedMessage
 * @return {string[]}
 */
var decode = function (encodedMessage) {
    let left = 0;
    let right = encodedMessage.length - 1;

    let shiftsForCharacter = 0;
    const decodedMessage = new Array();

    while (left < right) {

        let chunkSize = 0;
        let digitPlace = 1;
        while (encodedMessage.charAt(right) !== Util.DELIMITER_CHUNK_SIZE) {
            chunkSize = chunkSize + digitPlace * (encodedMessage.codePointAt(right) - Util.ASCII_ZERO);
            --right;
            digitPlace *= 10;
        }
        --right;

        const decodedChunk = new Array();
        const chunkBoundary = left + chunkSize;
        while (left < chunkBoundary) {
            const decoded = reverseShiftRight(encodedMessage.codePointAt(left), shiftsForCharacter);
            decodedChunk.push(decoded);
            shiftsForCharacter = (shiftsForCharacter + 1) % Util.SIZE_EXTENDED_ASCII;
            ++left;
        }
        decodedMessage.push(decodedChunk.join(''));
    }

    return decodedMessage;
};

/**
 * @param {number} CodePointCharacter
 * @param {number} shiftsForCharacter
 * @return {string}
 */
function shiftRight(CodePointCharacter, shiftsForCharacter) {
    return String.fromCodePoint((CodePointCharacter + shiftsForCharacter) % Util.SIZE_EXTENDED_ASCII);
}

/**
 * @param {number} CodePointCharacter
 * @param {number} shiftsForCharacter
 * @return {string}
 */
function reverseShiftRight(CodePointCharacter, shiftsForCharacter) {
    return String.fromCodePoint((2 * Util.SIZE_EXTENDED_ASCII + CodePointCharacter - shiftsForCharacter) % Util.SIZE_EXTENDED_ASCII);
}

class Util {
    static   SIZE_EXTENDED_ASCII = 256;
    static   DELIMITER_CHUNK_SIZE = ',';
    static   ASCII_ZERO = 48;
}
