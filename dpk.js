const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  let candidate = getCandidate(event);
  partition_key = sanitizeCandidate(candidate);
  return partition_key;
};

function getCandidate(event){
  const TRIVIAL_PARTITION_KEY = "0";
  if (event) {
    if (event.partitionKey) {
      return event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      return toSha(data)
    }
  }else{
    return TRIVIAL_PARTITION_KEY;
  }
}

function sanitizeCandidate(candidate){
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = toSha(candidate)
  }
  return candidate;
}

function toSha(data){
  return crypto.createHash("sha3-512").update(data).digest("hex");
}
