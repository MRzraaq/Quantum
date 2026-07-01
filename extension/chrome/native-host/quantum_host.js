const path = require("path");
const fs = require("fs");
const logFile = path.join(__dirname, "host_log.txt");

function log(msg) {
  fs.appendFileSync(logFile, msg + "\n");
}

function readMessage() {
  return new Promise((resolve) => {
    let rawData = [];
    
    process.stdin.on("data", (chunk) => {
      rawData.push(chunk);
    });

    process.stdin.on("end", () => {
      const buffer = Buffer.concat(rawData);
      const msgLength = buffer.readUInt32LE(0);
      const msgContent = buffer.slice(4, 4 + msgLength).toString();
      resolve(JSON.parse(msgContent));
    });
  });
}

function sendMessage(msg) {
  const json = JSON.stringify(msg);
  const buffer = Buffer.alloc(4 + json.length);
  buffer.writeUInt32LE(json.length, 0);
  buffer.write(json, 4);
  process.stdout.write(buffer);
}

async function main() {
  try {
    const message = await readMessage();
    log("Received URL: " + message.url);

    log("Would launch Quantum with: " + message.url);

    sendMessage({ status: "ok", url: message.url });
  } catch (err) {
    log("Error: " + err.message);
    sendMessage({ status: "error", message: err.message });
  }
}

main();