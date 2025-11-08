
#include <vector>
#include <ranges>
#include <string>
using namespace std;

class Codec {

    static const int SIZE_EXTENDED_ASCII = 256;
    static const char DELIMITER_CHUNK_SIZE = ',';

public:
    string encode(vector<string>& messageChunks) const {
        int shiftsForCharacter = 0;
        string encodedMessage;
        string sizePerMessageChunk;

        for (const auto& current : messageChunks) {
            for (const auto& character : current) {
                char encoded = shiftRight(character, shiftsForCharacter);
                encodedMessage.push_back(encoded);
                shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII;
            }
            sizePerMessageChunk.append(to_string(current.length()));
            sizePerMessageChunk.push_back(DELIMITER_CHUNK_SIZE);
        }

        ranges::reverse(sizePerMessageChunk);
        encodedMessage.append(sizePerMessageChunk);

        return encodedMessage;
    }

    vector<string> decode(string encodedMessage) const {
        int left = 0;
        int right = encodedMessage.length() - 1;

        int shiftsForCharacter = 0;
        vector<string> decodedMessage;

        while (left < right) {

            int chunkSize = 0;
            while (encodedMessage[right] != DELIMITER_CHUNK_SIZE) {
                chunkSize = chunkSize * 10 + (encodedMessage[right] - '0');
                --right;
            }
            --right;

            string decodedChunk;
            int chunkBoundary = left + chunkSize;
            while (left < chunkBoundary) {
                char decoded = reverseShiftRight(encodedMessage[left], shiftsForCharacter);
                decodedChunk.push_back(decoded);
                shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII;
                ++left;
            }
            decodedMessage.push_back(decodedChunk);
        }

        return decodedMessage;
    }

private:
    char shiftRight(char character, int shiftsForCharacter) const {
        return (character + shiftsForCharacter) % SIZE_EXTENDED_ASCII;
    }

    char reverseShiftRight(char character, int shiftsForCharacter) const {
        return (2 * SIZE_EXTENDED_ASCII + character - shiftsForCharacter) % SIZE_EXTENDED_ASCII;
    }
};
