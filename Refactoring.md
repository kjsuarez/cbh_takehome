
# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Explanation
In order to better describe what `deterministicPartitionKey` is actually doing, I aimed for a test-driven approach, writing my tests first before considering a more appropriate structure for the function. After writing tests the function's goal becomes more clear-
Given an object as input, generate a key from that object's data using the best  method available.
in order those methods are-
 1. Use the partitionKey attribute of the input
 2. Use a sha3 of the entire object strigified
 3. Use a placeholder string if the input is null

The function than makes sure that the output is a string of an acceptable length, sha-ing the output if necessary.

The biggest change I made was abstracting these two steps into separate functions. We first determine the best candidate from the data provided, and then sanitize it into a string of the appropriate length. The original implementation makes no distinction between picking a candidate and making changes to that candidate's data, which is unacceptable. The cluttered `if else` trees make it difficult to parse the intentions of lines that are executing simple operations. Once abstracted into separate functions the intentions of the original `if` statements become trivial to parse.
There was some repetition in calling the `crypto.createHash` function train, so I moved that to a separate function as well, purely for readability.
