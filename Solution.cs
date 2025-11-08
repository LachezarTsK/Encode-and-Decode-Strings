
using System;
using System.Text;
using System.Collections.Generic;

public class Codec
{
    private static readonly int SIZE_EXTENDED_ASCII = 256;
    private static readonly char DELIMITER_CHUNK_SIZE = ',';

    public string encode(IList<string> messageChunks)
    {
        int shiftsForCharacter = 0;
        StringBuilder encodedMessage = new StringBuilder();
        StringBuilder sizePerMessageChunk = new StringBuilder();

        foreach (string current in messageChunks)
        {
            foreach (char character in current)
            {
                char encoded = shiftRight(character, shiftsForCharacter);
                encodedMessage.Append(encoded);
                shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII;
            }
            sizePerMessageChunk.Append(current.Length).Append(DELIMITER_CHUNK_SIZE);
        }

        ReverseStringBuilder(sizePerMessageChunk);
        encodedMessage.Append(sizePerMessageChunk);

        return encodedMessage.ToString();
    }

    public IList<string> decode(string encodedMessage)
    {
        int left = 0;
        int right = encodedMessage.Length - 1;

        int shiftsForCharacter = 0;
        List<string> decodedMessage = [];

        while (left < right)
        {
            int chunkSize = 0;
            while (encodedMessage[right] != DELIMITER_CHUNK_SIZE)
            {
                chunkSize = chunkSize * 10 + (encodedMessage[right] - '0');
                --right;
            }
            --right;

            StringBuilder decodedChunk = new StringBuilder();
            int chunkBoundary = left + chunkSize;
            while (left < chunkBoundary)
            {
                char decoded = reverseShiftRight(encodedMessage[left], shiftsForCharacter);
                decodedChunk.Append(decoded);
                shiftsForCharacter = (shiftsForCharacter + 1) % SIZE_EXTENDED_ASCII;
                ++left;
            }
            decodedMessage.Add(decodedChunk.ToString());
        }

        return decodedMessage;
    }

    private void ReverseStringBuilder(StringBuilder sb)
    {
        int left = 0;
        int right = sb.Length - 1;

        while (left < right)
        {
            char temp = sb[left];
            sb[left] = sb[right];
            sb[right] = temp;
            ++left;
            --right;
        }
    }

    private char shiftRight(char character, int shiftsForCharacter)
    {
        return (char)((character + shiftsForCharacter) % SIZE_EXTENDED_ASCII);
    }

    private char reverseShiftRight(char character, int shiftsForCharacter)
    {
        return (char)((2 * SIZE_EXTENDED_ASCII + character - shiftsForCharacter) % SIZE_EXTENDED_ASCII);
    }
}
