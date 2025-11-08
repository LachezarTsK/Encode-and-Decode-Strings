
function encode(messageChunks: string[]): string {
    let shiftsForCharacter = 0;
    const encodedMessage: string[] = new Array();
    const sizePerMessageChunk: string[] = new Array();

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

function decode(encodedMessage: string): string[] {
    let left = 0;
    let right = encodedMessage.length - 1;

    let shiftsForCharacter = 0;
    const decodedMessage: string[] = new Array();

    while (left < right) {

        let chunkSize = 0;
        let digitPlace = 1;
        while (encodedMessage.charAt(right) !== Util.DELIMITER_CHUNK_SIZE) {
            chunkSize = chunkSize + digitPlace * (encodedMessage.codePointAt(right) - Util.ASCII_ZERO);
            --right;
            digitPlace *= 10;
        }
        --right;

        const decodedChunk: string[] = new Array();
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

function shiftRight(CodePointCharacter: number, shiftsForCharacter: number): string {
    return String.fromCodePoint((CodePointCharacter + shiftsForCharacter) % Util.SIZE_EXTENDED_ASCII);
}

function reverseShiftRight(CodePointCharacter: number, shiftsForCharacter: number): string {
    return String.fromCodePoint((2 * Util.SIZE_EXTENDED_ASCII + CodePointCharacter - shiftsForCharacter) % Util.SIZE_EXTENDED_ASCII);
}

class Util {
    static SIZE_EXTENDED_ASCII = 256;
    static DELIMITER_CHUNK_SIZE = ',';
    static ASCII_ZERO = 48;
}
