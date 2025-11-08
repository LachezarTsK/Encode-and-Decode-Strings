
package main

import (
    "reflect"
    "strconv"
    "strings"
)

const SIZE_EXTENDED_ASCII = 256
const DELIMITER_CHUNK_SIZE = ','

type Codec struct {}

func (codec *Codec) Encode(messageChunks []string) string {
    shiftsForCharacter := 0
    encodedMessage := strings.Builder{}
    sizePerMessageChunk := strings.Builder{}

    for _, current := range messageChunks {
        for i := range current {
            encoded := shiftRight(current[i], shiftsForCharacter)
            encodedMessage.WriteByte(encoded)
            shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII
        }
        sizePerMessageChunk.WriteString(strconv.Itoa(len(current)))
        sizePerMessageChunk.WriteByte(DELIMITER_CHUNK_SIZE)
    }

    reversed := reverseString(sizePerMessageChunk.String())
    encodedMessage.WriteString(reversed)

    return encodedMessage.String()
}

func (codec *Codec) Decode(encodedMessage string) []string {
    left := 0
    right := len(encodedMessage) - 1

    shiftsForCharacter := 0
    decodedMessage := []string{}

    for left < right {

        chunkSize := 0
        for encodedMessage[right] != DELIMITER_CHUNK_SIZE {
            chunkSize = chunkSize * 10 + int(encodedMessage[right] - '0')
            right--
        }
        right--

        decodedChunk := strings.Builder{}
        chunkBoundary := left + chunkSize
        for left < chunkBoundary {
            decoded := reverseShiftRight(encodedMessage[left], shiftsForCharacter)
            decodedChunk.WriteByte(decoded)
            shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII
            left++
        }
        decodedMessage = append(decodedMessage, decodedChunk.String())
    }

    return decodedMessage
}

func shiftRight(character byte, shiftsForCharacter int) byte {
    return byte((int(character) + shiftsForCharacter) % SIZE_EXTENDED_ASCII)
}

func reverseShiftRight(character byte, shiftsForCharacter int) byte {
    return byte((2 * SIZE_EXTENDED_ASCII + int(character) - shiftsForCharacter) % SIZE_EXTENDED_ASCII)
}

func reverseString(input string) string {
    left := 0
    right := len(input) - 1
    reversed := strings.Split(input, "")
    swap := reflect.Swapper(reversed)

    for left < right {
        swap(left, right)
        left++
        right--
    }
    return strings.Join(reversed, "")
}
