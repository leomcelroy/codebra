import { createListener } from "../createListener.js";

export function addUpload(state) {
  const listen = createListener(document.body);

  const cmEl = document.querySelector("cm-editor")
  const cm = cmEl.codemirror;

  state.actions.run = async () => {
    const code = cm.state.doc.toString();
    
    state.uploading = true;
    state.actions.render();

    await uploadStringToFile(code, "main.py");

    state.uploading = false;
    state.actions.render();
  }

  listen("click", ".upload-trigger", e => {
    state.actions.run();
  });

  window.addEventListener("keydown", e => {
      const isEnter = e.keyCode === 13;

      if (isEnter && e.shiftKey) {
        state.actions.run();
        e.preventDefault();
      }
    })

    async function uploadStringToFile(content, filename) {
      const { port } = state;

      async function writeMsg(str, ms = 10) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str); // Escape double quotes and write each line
        await port.write(data);
        await new Promise(resolve => setTimeout(resolve, ms));
      }

      // content = content.replaceAll(`"""`, `\"\"\"`);

      if (content.includes("'''")) {
        console.log(`please don't use '''...''' us """...""" instead`)
        return;
      }

      // TODO: how to make \ work
      // content = content.replaceAll("\\", "\\\\")

      await writeMsg('\x01'); // raw mode

      let msg = 
        `f = open("${filename}", "w")\n` + 
        `f.write('''${content}''')\n`    + 
        `f.close()`

      await writeMsg(msg);
      await writeMsg('\x04'); // compile execute
      await writeMsg('\x02'); // exit

      await writeMsg(`import machine\r\n`);
      await writeMsg(`machine.reset()\r\n`, 2000);

      state.actions.autoconnect();
  }
}

/*



let toWrite = "";
// await writeMsg(`with open("${filename}", "w") as f:\r\n`);
await writeMsg(`f = open("${filename}", "w")\r\n`);
const lines = content.split('\n');
for (const line of lines) {
  // toWrite += `f.write("${line.replace(/"/g, '\\"')}")\n`;
    await writeMsg(`f.write("${line.replace(/"/g, '\\"')}\\n")\r\n`);
}
await writeMsg(`f.close()\r\n`);

await writeMsg(toWrite);

// await writeMsg(`import os\r\n`);
// await writeMsg(`print(os.listdir())\r\n\r\n\r\n`);
// await writeMsg(`with open("main.py", "r") as f:`);
// await writeMsg(`  print(f.read())\r\n\r\n\r\n`);

await writeMsg(`import machine\r\n`);
await writeMsg(`machine.reset()\r\n`, 2000);

*/