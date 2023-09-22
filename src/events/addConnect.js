import { createListener } from "../createListener.js";

export function addConnect(state) {
    const listen = createListener(document.body);

    listen("click", ".connect-trigger", async (e) => {
        const port = await navigator.serial.requestPort();
        attemptConnect(port);
    });

    async function attemptConnect(port) {
        try {
            await port.open({ baudRate: 115200 });

            state.writer = port.writable.getWriter();
            state.reader = port.readable.getReader();

            readLoop();

            state.port = port;
            const msg = 'Connected to MicroPython REPL. Type your commands or run a program!'
            state.logs.push(msg);

            state.actions.render();
        } catch (error) {
            console.error("There was an error connecting to the device:", error);
        }
    }


    const outputDiv = document.querySelector(".log-output");

    async function readLoop() {
        let soFar = [];

        try {
            while (true) {
                const { reader } = state;
                const { value, done } = await reader.read();
                if (value) {
                    const log = new TextDecoder().decode(value);
                    soFar.push(log);

                    if (log.endsWith(">>> ") || /\.\.\.\s+$/.test(log)) {
                        const str = soFar.join("")
                        const arr = str.split("\r\n");
                        if (log.endsWith(">>> ")) arr.pop();
                        const last = arr.pop();

                        if (arr.length > 0) state.logs.push(arr.join(""));
                        state.logs.push(last);
                        soFar = [];
                        state.actions.render();

                        outputDiv.scrollTop = outputDiv.scrollHeight;  // Auto-scroll to bottom
                    }
                }
                if (done) {
                    reader.releaseLock();
                    break;
                }
            }
        } catch (err) {
            state.port = null;
            state.actions.render();
        }
        
    }

    async function automaticallyConnect() {
        const ports = await navigator.serial.getPorts()

        ports.forEach(async port => {
          const info = port.getInfo()

          if (info.usbVendorId === 11914) {
            attemptConnect(port);
          }
        })
      }

      automaticallyConnect();

}




