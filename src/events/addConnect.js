import { createListener } from "../createListener.js";
import { createWebSerialBuffer } from "../createWebSerialBuffer.js";

export function addConnect(state) {
    const listen = createListener(document.body);

    readLoop();

    listen("click", ".print-files", async e => {
      async function writeMsg(str, ms = 10) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str); // Escape double quotes and write each line
        await state.port.write(data);
        await new Promise(resolve => setTimeout(resolve, ms));
      }

      await writeMsg(`import os\r\n`);
      await writeMsg('\x01'); // raw mode
// await writeMsg(`print(os.listdir())\r\n\r\n\r\n`);
// await writeMsg(`with open("main.py", "r") as f:`);
// await writeMsg(`  print(f.read())\r\n\r\n\r\n`);

      let msg = `
for fileName in os.listdir():
  with open(fileName, "r") as f:
    print("")
    print(f"-- {fileName} --")
    print("")
    print(f.read())
    print("")
    print(f"-----")
    print("")
`
      await writeMsg(msg);
      await writeMsg('\x04'); // compile execute
      await writeMsg('\x02'); // exit

    })

    listen("click", ".connect-trigger", async (e) => {
        if (state.port !== null) {
            await state.port.close();
            state.port = null;
            state.actions.render();
            return;
        }

        const port = await navigator.serial.requestPort();
        attemptConnect(port);
    });

    async function attemptConnect(port) {
        console.log("attempt to connect to port", port);
        try {
          state.port = await createWebSerialBuffer(port);
          state.logs = "";
          state.logs += `Connected to MicroPython REPL.\n`
          state.logs += `Type your commands or run a program!\n`
          state.logs += `\n>>> `

          state.actions.render();

        } catch (error) {
            console.error("There was an error connecting to the device:", error);
        }


    }


    const outputDiv = document.querySelector(".log-output");

    function readLoop() {
        setInterval(() => {
            if (state.port === null) return;

            while (state.port.available()) {
                const byte = state.port.read();
                if (byte && !state.uploading) {
                    const log = String.fromCharCode(byte);
                    state.logs += log;
                    state.actions.render();
                    outputDiv.scrollTop = outputDiv.scrollHeight;
                }
            }
        }, 0);

        // catch (err) {
        //     await state.port.close();
        //     state.port = null;
        //     state.actions.render();
        // }
        
    }

    async function automaticallyConnect() { 
        if (state.port) await state.port.close();
        state.port = null;
        
        const ports = await navigator.serial.getPorts()

        ports.forEach(async port => {
          const info = port.getInfo()

          if (info.usbVendorId === 11914) {
            await attemptConnect(port);
          }
        })
      }

      state.actions.autoconnect = automaticallyConnect;

      automaticallyConnect();

}




