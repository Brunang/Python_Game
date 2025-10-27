import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import Sk from "skulpt";

export default function BlocklyDemo() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    // Create Blockly workspace
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="controls_repeat_ext"></block>
          <block type="math_number"></block>
          <block type="text_print"></block>
        </xml>
      `,
    });
  }, []);

  const runCode = () => {
    const code = Blockly.Python.workspaceToCode(workspaceRef.current);
    outputRef.current.textContent = "";

    Sk.configure({
      output: (text) => (outputRef.current.textContent += text),
    });

    Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody("<stdin>", false, code, true)
    ).catch((err) => {
      outputRef.current.textContent += "\nError: " + err.toString();
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Blockly + Skulpt Demo 🧙‍♀️
      </h1>

      <div className="flex gap-4">
        <div ref={blocklyDiv} className="h-96 w-2/3 border rounded-lg" />
        <div className="w-1/3">
          <button
            onClick={runCode}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Run Code
          </button>
          <pre
            ref={outputRef}
            className="mt-4 p-2 bg-black text-green-400 h-80 overflow-auto rounded"
          />
        </div>
      </div>
    </div>
  );
}
