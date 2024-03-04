import { GLOBAL_STATE } from "./GLOBAL_STATE.js";

function readLoop() {
    setInterval(() => {
        if (GLOBAL_STATE.port === null) return;

        while (GLOBAL_STATE.port.available()) {
            const byte = GLOBAL_STATE.port.read();
            if (byte && !GLOBAL_STATE.uploading) {
                const log = String.fromCharCode(byte);
                GLOBAL_STATE.logs += log;
                GLOBAL_STATE.actions.render();
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
