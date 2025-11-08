
import java.util.ArrayList;
import java.util.List;

public class Codec {

    private static final int SIZE_EXTENDED_ASCII = 256;
    private static final char DELIMITER_CHUNK_SIZE = ',';

    public String encode(List<String> messageChunks) {
        int shiftsForCharacter = 0;
        StringBuilder encodedMessage = new StringBuilder();
        StringBuilder sizePerMessageChunk = new StringBuilder();

        for (String current : messageChunks) {
            for (char character : current.toCharArray()) {
                char encoded = shiftRight(character, shiftsForCharacter);
                encodedMessage.append(encoded);
                shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII;
            }
            sizePerMessageChunk.append(current.length()).append(DELIMITER_CHUNK_SIZE);
        }

        sizePerMessageChunk.reverse();
        encodedMessage.append(sizePerMessageChunk);

        return encodedMessage.toString();
    }

    public List<String> decode(String encodedMessage) {
        int left = 0;
        int right = encodedMessage.length() - 1;

        int shiftsForCharacter = 0;
        List<String> decodedMessage = new ArrayList<>();

        while (left < right) {

            int chunkSize = 0;
            while (encodedMessage.charAt(right) != DELIMITER_CHUNK_SIZE) {
                chunkSize = chunkSize * 10 + (encodedMessage.charAt(right) - '0');
                --right;
            }
            --right;

            StringBuilder decodedChunk = new StringBuilder();
            int chunkBoundary = left + chunkSize;
            while (left < chunkBoundary) {
                char decoded = reverseShiftRight(encodedMessage.charAt(left), shiftsForCharacter);
                decodedChunk.append(decoded);
                shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII;
                ++left;
            }
            decodedMessage.add(decodedChunk.toString());
        }

        return decodedMessage;
    }

    private char shiftRight(char character, int shiftsForCharacter) {
        return (char) ((character + shiftsForCharacter) % SIZE_EXTENDED_ASCII);
    }

    private char reverseShiftRight(char character, int shiftsForCharacter) {
        return (char) ((2 * SIZE_EXTENDED_ASCII + character - shiftsForCharacter) % SIZE_EXTENDED_ASCII);
    }
}
