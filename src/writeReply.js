import { GLOBAL_STATE } from "./GLOBAL_STATE.js";
import { unindent } from "./unindent.js";

async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function initRepl(port) {

  await reset();

  async function writeMsg(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str); // Escape double quotes and write each line
    await port.write(data);
  }

  async function reset() {
    await writeMsg("\x01"); // raw mode
    await sleep(150);
    port.flush();
  }

  async function write(content) {
    await writeMsg(content);
    await writeMsg("\x04");

    const reply = await port.readUntil("\x04");
    const error = await port.readUntil("\x04");
    port.flush();

    let replyString = "";
    let errorString = "";

    for (let i = 0; i < reply.length; i++) {
      replyString += String.fromCharCode(reply[i]);
    }

    for (let i = 0; i < error.length; i++) {
      errorString += String.fromCharCode(error[i]);
    }

    // trim "OK" from start, trim "\x04" from end
    return { reply: replyString.slice(2, -1), error: errorString.slice(2, -2) };
  
  }

  return {
    write,
    reset,
    async close() {
      await writeMsg('\x02');
      await sleep(150);
      port.flush();
    },
    async reboot() {
      await writeMsg(`import machine\r\n`);
      await writeMsg(`machine.reset()\r\n`);
      await sleep(150);
      GLOBAL_STATE.actions.autoconnect();
    },
    async getfiles() {
      const msg = unindent`
        import os
        import json

        files = []

        for fileName in os.listdir():
          with open(fileName, "r") as f:
            files.append([fileName, f.read()])

        print(json.dumps(files))
          
      `

      const result = await write(msg);
      const files = JSON.parse(result.reply);
      
      return files;
    },
    async writeFile(filename, content) {
      const msg = unindent`
        f = open("${filename}", "w")
        f.write('''${content}''')
        f.close()
      `

      const result = await write(msg);

      return result;
    },
    async readFile(filename) {
      const msg = unindent`
        f = open("${filename}", "r")
        text = f.read()
        print(text)
      `
      
      const result = await write(msg);

      return result;
    },
    async deleteFile() {

    }
  }
}
