# Encode-and-Decode-Strings
Challenge at LeetCode.com. Tags: String, Design, Encryption.

---------------------------------------------------------------------------------------------------------------------

In addition to encoding and decoding, the algorithm implements encryption and decryption of the string. Understandably, the program will run faster with implementation of only encoding and decoding - which most, if not all, of the solutions posted on leetcode do - but this twist makes the solution more interesting and more in line with the connotation of the problem title.

Anyway, the algorithm is implemented in such a way that no special consideration is needed for the selection of the delimiter. This is because the delimiters are placed not within the encoded/encrypted message but within the string containing the sizes of the message chunks, which in turn is appended to the encoded/encrypted message.

Solving the problem in this way, makes the decoding/decrypting part of the algorithm a classical two-pointers implementation.
