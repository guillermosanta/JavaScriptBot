const internal = require("stream");
const vm = require("vm");
const roundTo = require("./utils/roundTo.js");
const CODE_BLOCK = "```";

const run = async (code, message) => {
  const systemVariables = {
    executionTime: { displayName: "🕒 Execution Time" },
    terminal: { displayName: "📝 Terminal" },
    error: { displayName: "⚠️ Error" },
  };

  const context = { terminal: [] };
  vm.createContext(context); // Create context for the code to run in

  //The console is not available in VM, so we create our own "terminal" to store the consoled values

  try {
    const t0 = performance.now();
    await vm.runInContext(formatCode(code), context);
    const t1 = performance.now();
    systemVariables.terminal.value = context.terminal;
    systemVariables.executionTime.value = `${roundTo(t1 - t0, 3)} ms`;
  } catch (error) {
    systemVariables.error.value = `${error.name} - ${error.message}`;
  }

  const embed = {
    color: 0xf7df1e,
    footer: { text: `Code executed by ${message.author.id}` },
  };

  embed.fields = Object.entries(systemVariables)
    .filter(([_, systemVariable]) =>
      Array.isArray(systemVariable.value) ? systemVariable.value.length !== 0 : systemVariable.value
    )
    .map(([key, systemVariable]) => {
      return {
        name: systemVariable.displayName,
        value: `${CODE_BLOCK}${
          key === "terminal" ? systemVariable.value.join("\n") : systemVariable.value
        }${CODE_BLOCK} `,
      };
    });

  message.reply({ embeds: [embed] });
};

module.exports = run;

const formatCode = (code) => {
  const formattedCode = code.map((line) => findAndChangeConsoleLogs(line)).join(";");
  return formattedCode;
};

// Changes all console.log() to terminal.push()
const findAndChangeConsoleLogs = (line) => {
  const regEx = /console\.log\((.+)\)/;

  const match = line.match(regEx);
  if (!match) return line;
  const stringify = !match[1].includes(`\"`);
  return (
    line.substring(0, match.index) +
    `terminal.push(${stringify ? `JSON.stringify(${match[1]})` : match[1]})` +
    line.substring(match.index + 13 + match[1].length)
  );
};
