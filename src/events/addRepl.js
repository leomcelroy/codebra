

export function addRepl(state) {

  const inputField = document.querySelector(".repl-input");

  inputField.addEventListener('keydown', async (event) => {
      const { port } = state;

      if (event.key === 'Enter') {
        const val = inputField.value;

        const encoder = new TextEncoder();
        const data = encoder.encode(val + '\r\n');

        await port.write(data);
        inputField.value = '';
      }
  });
}