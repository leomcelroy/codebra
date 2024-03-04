import { createListener } from "../createListener.js";
import { createWebSerialBuffer } from "../createWebSerialBuffer.js";
import { initRepl } from "../writeReply.js";

export function addConnect(state) {
    const listen = createListener(document.body);

    listen("click", ".print-files", async e => {

      const files = await state.repl.getFiles();

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
          state.repl = await initRepl(state.port);

          state.logs = "";
          state.logs += `Connected to MicroPython REPL.\n`
          state.logs += `Type your commands or run a program!\n`
          state.logs += `\n>>> `

          state.actions.render();

        } catch (error) {
            console.error("There was an error connecting to the device:", error);
        }


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




