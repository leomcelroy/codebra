export async function createWebSerialBuffer(port, baudrate = 115200) {
  const buffer = [];

  await port.open({ baudRate: baudrate })

  let reader = null
  let writer = null

  async function stuffBuffer() {
    try {
      while (port.readable) {
        reader = port.readable.getReader()

        while (true) {
          const { value, done } = await reader.read()

          if (value) {
            for (let i = 0; i < value.length; i++) {
              const byte = value[i];
              buffer.push(byte);
            }
          }

          if (done) {
            reader.releaseLock()
            reader = null
            break
          }
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      // await port.close();
    }
  }

  stuffBuffer()

  async function write(msg) {
    writer = port.writable.getWriter();
    await writer.write(msg);
    writer.releaseLock();
    writer = null;
  }

  return {
    write,
    flush: () => {
      while (buffer.length > 0) {
        buffer.pop();
      }

      return;
    },
    read: () => {
      if (buffer.length === 0) return null;

      return buffer.shift();
    },
    readUntil: async (targetByte, maxDuration = 2000) => {

      let result = [];
      targetByte = targetByte.charCodeAt(0);

      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = setInterval(async () => {
          if (Date.now() - startTime > maxDuration) {
            clearInterval(interval);
            console.warn("Timeout reached before condition was met");
            resolve(result);
          } 

          if (buffer.length === 0) {
            return;
          }

          const byteToAdd = buffer.shift();

          let returnString = "";

          for (let i = 0; i < result.length; i++) {
            returnString += String.fromCharCode(result[i]);
          }

          if (byteToAdd === targetByte) {
            result.push(byteToAdd);
            clearInterval(interval);
            resolve(result);
          } else {
            result.push(byteToAdd);
          }
        }, 1);
      });
    },
    available: () => buffer.length > 0,
    close: async () => {
      if (reader) {
        reader.releaseLock()
      }

      if (writer) {
        writer.releaseLock()
      }

      await port.close()

      return
    }
  }
}

async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}