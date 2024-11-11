import { GLOBAL_STATE } from "./GLOBAL_STATE.js";
import { unindent } from "./unindent.js";

async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function initRepl(port) {
  const startMsg = await reset();
  console.log({ startMsg });

  async function writeMsg(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str); // Escape double quotes and write each line
    const newPromise = await port.write(data);
  }

  async function write(content, maxWaitMs = 2000) {
    await writeMsg(content);
    await writeMsg("\x04");

    const reply = await port.readUntil("\x04", maxWaitMs);
    const error = await port.readUntil("\x04", maxWaitMs);
    const flushed = port.flush();

    let replyString = "";
    let errorString = "";

    for (let i = 0; i < reply.length; i++) {
      replyString += String.fromCharCode(reply[i]);
    }

    for (let i = 0; i < error.length; i++) {
      errorString += String.fromCharCode(error[i]);
    }

    // trim "OK" from start, trim "\x04" from end
    return {
      reply: replyString.slice(2, -1),
      error: errorString.slice(0, -1),
    };
  }

  async function reset() {
    await writeMsg("\x01"); // raw mode
    await sleep(150);
    const flushed = port.flush();

    return flushed;
  }

  return {
    write,
    reset,
    async reboot() {
      await writeMsg("\x02"); // exit
      const msg = `import machine\r\n` + `machine.reset()\r\n`;

      await writeMsg(msg);
      await sleep(2000);
      GLOBAL_STATE.actions.autoconnect();
    },
    async close() {
      await writeMsg("\x02");
      await sleep(150);
      port.flush();
    },
    async getFileNames() {
      const msg = unindent`
        import os
        import json

        print(json.dumps(os.listdir()))
      `;

      const result = await write(msg);
      const files = JSON.parse(result.reply);

      return files;
    },
    async getFiles() {
      const msg = unindent`
        import os
        import json

        files = []

        for fileName in os.listdir():
          with open(fileName, "r") as f:
            files.append([fileName, f.read()])

        print(json.dumps(files))
          
      `;

      const result = await write(msg);
      const files = JSON.parse(result.reply);

      return files;
    },
    async writeFile(filename, content) {
      const msg =
        `f = open("${filename}", "w")\n` +
        `f.write('''${content}''')\n` +
        `f.close()`;

      const result = await write(msg);

      await writeMsg("\x04"); // compile execute

      return result;
    },
    async readFile(filename) {
      const msg = unindent`
        f = open("${filename}", "r")
        text = f.read()
        print(text)
      `;

      const result = await write(msg);

      return result;
    },
    async deleteFile(filename) {
      const msg = unindent`
        import os

        def delete_file(filename):
            try:
                if filename in os.listdir():
                    os.remove(filename)
                    print(f"File '{filename}' has been deleted.")
                else:
                    print(f"File '{filename}' does not exist.")
            except OSError as e:
                print(f"Error deleting file: {e}")

        delete_file("${filename}")

      `;

      const result = await write(msg);

      return result;
    },
  };
}
