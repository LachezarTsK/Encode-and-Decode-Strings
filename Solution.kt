
class Codec {

    private companion object {
        const val SIZE_EXTENDED_ASCII = 256
        const val DELIMITER_CHUNK_SIZE = ','
    }

    fun encode(messageChunks: List<String>): String {
        var shiftsForCharacter = 0
        val encodedMessage = StringBuilder()
        val sizePerMessageChunk = StringBuilder()

        for (current in messageChunks) {
            for (character in current) {
                val encoded = shiftRight(character, shiftsForCharacter)
                encodedMessage.append(encoded)
                shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII
            }
            sizePerMessageChunk.append(current.length).append(DELIMITER_CHUNK_SIZE)
        }

        sizePerMessageChunk.reverse()
        encodedMessage.append(sizePerMessageChunk)

        return encodedMessage.toString()
    }

    fun decode(encodedMessage: String): List<String> {
        var left = 0
        var right = encodedMessage.length - 1

        var shiftsForCharacter = 0
        val decodedMessage = mutableListOf<String>()

        while (left < right) {

            var chunkSize = 0
            while (encodedMessage[right] != DELIMITER_CHUNK_SIZE) {
                chunkSize = chunkSize * 10 + (encodedMessage[right] - '0')
                --right
            }
            --right

            val decodedChunk = StringBuilder()
            val chunkBoundary = left + chunkSize
            while (left < chunkBoundary) {
                val decoded = reverseShiftRight(encodedMessage[left], shiftsForCharacter)
                decodedChunk.append(decoded)
                shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII
                ++left
            }
            decodedMessage.add(decodedChunk.toString())
        }

        return decodedMessage
    }

    private fun shiftRight(character: Char, shiftsForCharacter: Int): Char {
        return ((character.code + shiftsForCharacter) % SIZE_EXTENDED_ASCII).toChar()
    }

    private fun reverseShiftRight(character: Char, shiftsForCharacter: Int): Char {
        return ((2 * SIZE_EXTENDED_ASCII + character.code - shiftsForCharacter) % SIZE_EXTENDED_ASCII).toChar()
    }
}
