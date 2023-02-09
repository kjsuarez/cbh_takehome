const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

let str = ""
for(var o=0;o<257;o++){str += "0"}
const long_string = str

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns event.partitionKey when this attribute is a string under 256 characters long", () => {
    let myEvent = {partitionKey: "a very secure key"}
    const trivialKey = deterministicPartitionKey(myEvent);
    expect(trivialKey).toBe("a very secure key");
  });

  it("Returns a strinified event.partitionKey if it is under 256 chars", () => {
    let myEvent = {
      partitionKey: {
        val: "a leetle object"
      }
    }
    key_str = JSON.stringify(myEvent.partitionKey)
    const trivialKey = deterministicPartitionKey(myEvent);
    expect(trivialKey).toBe(key_str);
  });

  it("Returns a sha3 of strinified event.partitionKey if it is over 256 chars", () => {
    let myEvent = {
      partitionKey: {
        val: long_string
      }
    }
    key_str = JSON.stringify(myEvent.partitionKey)
    hashed_key = crypto.createHash("sha3-512").update(key_str).digest("hex");
    const trivialKey = deterministicPartitionKey(myEvent);
    expect(trivialKey).toBe(hashed_key);
  });

  it("Returns a sha3 of the whole event strinified if it lacks a partitionKey", () => {
    let myEvent = {
      notAPartitionKey: {
        val: "this is not a partitionKey"
      }
    }
    event_str = JSON.stringify(myEvent)
    hashed_event = crypto.createHash("sha3-512").update(event_str).digest("hex");
    const trivialKey = deterministicPartitionKey(myEvent);
    expect(trivialKey).toBe(hashed_event);

    let string_event = "just a string"
    event_str = JSON.stringify(string_event)
    hashed_event = crypto.createHash("sha3-512").update(event_str).digest("hex");
    const strKey = deterministicPartitionKey(string_event);
    expect(strKey).toBe(hashed_event);

    let int_event = 123456789
    event_str = JSON.stringify(int_event)
    hashed_event = crypto.createHash("sha3-512").update(event_str).digest("hex");
    const intKey = deterministicPartitionKey(int_event);
    expect(intKey).toBe(hashed_event);
  });

});
