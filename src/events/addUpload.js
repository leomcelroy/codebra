import { createListener } from "../createListener.js";

export function addUpload(state) {
  const listen = createListener(document.body);

  const cmEl = document.querySelector("cm-editor")
  const cm = cmEl.codemirror;

  state.actions.run = (render = true) => {
    const code = cm.state.doc.toString();
    
    console.log(code);

    uploadStringToFile(code, "main.py")
    
    if (render) state.actions.render();
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
      const { writer, reader } = state;

      async function writeMsg(str, ms = 100) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str); // Escape double quotes and write each line
        await writer.write(data);
        await new Promise(resolve => setTimeout(resolve, ms));
      }

      const encoder = new TextEncoder();

      let toWrite = "";
      // await writeMsg(`with open("${filename}", "w") as f:\r\n`);
      toWrite += `f = open("${filename}", "w")\r\n`;
      const lines = content.split('\n');
      for (const line of lines) {
        toWrite += `f.write("${line.replace(/"/g, '\\"')}")\r\n`;
          // await writeMsg(`  f.write("${line.replace(/"/g, '\\"')}")\r\n`);
      }
      toWrite += `f.close()\r\n`;

      await writeMsg(toWrite, 2000);

      await writeMsg(`import os\r\n`);
      await writeMsg(`print(os.listdir())\r\n\r\n\r\n`);
      await writeMsg(`with open("main.py", "r") as f:`);
      await writeMsg(`  print(f.read())\r\n\r\n\r\n`);
  }
}