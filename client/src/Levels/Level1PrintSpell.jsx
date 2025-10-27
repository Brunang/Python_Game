import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import "blockly/python";
import * as Sk from "skulpt";

export default function Level1PrintSpell() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  // Lesson target + player input
  const TARGET = 'print("Hello there")';
  const [playerSpell, setPlayerSpell] = useState("");
  const [passed, setPassed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ------- Setup Blockly (minimal toolbox + prefill example) -------
  useEffect(() => {
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="text_print"></block>
          <block type="text"></block>
        </xml>
      `,
    });

    // Prefill example: print("🔥 Fireball!")
    const printBlock = workspaceRef.current.newBlock("text_print");
    const textBlock = workspaceRef.current.newBlock("text");
    textBlock.setFieldValue("🔥 Fireball!", "TEXT");
    printBlock.getInput("TEXT").connection.connect(textBlock.outputConnection);
    textBlock.initSvg(); textBlock.render();
    printBlock.initSvg(); printBlock.render();
  }, []);
  // -----------------------------------------------------------------

  const runCode = async () => {
    setErrorMsg("");

    // Require exact match for this lesson
    if (playerSpell !== TARGET) {
      setErrorMsg("The spell fizzles… Check each character and try again!");
      return;
    }

    // Run in Skulpt (we don't need to show output here)
    Sk.configure({
      output: () => {},
      read: (name) => {
        if (!Sk.builtinFiles || !Sk.builtinFiles["files"][name]) {
          throw "File not found: '" + name + "'";
        }
        return Sk.builtinFiles["files"][name];
      },
    });

    try {
      await Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody("<stdin>", false, playerSpell, true)
      );
      setPassed(true);
    } catch (e) {
      setErrorMsg("Skulpt error: " + String(e));
    }
  };

  // Success page
  if (passed) {
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center">✨ Your spell echoes…</h1>
        <div className="max-w-2xl mx-auto mt-6 bg-amber-50 border border-amber-300 rounded p-4">
          <p className="text-lg">
            A gentle voice answers: <em>“Hello there, apprentice.”</em>
            <br />
            <strong>Mentor:</strong> “Nicely done. Your words have power when
            shaped with logic.”
          </p>
          <p className="mt-4">
            <strong>Next:</strong> Learn to define your own spell with{" "}
            <code>def</code> …
          </p>
        </div>
      </div>
    );
  }

  // Lesson page
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center">🪄 Welcome, Young Wizard!</h1>

      {/* Scroll image */}
      <div className="flex justify-center my-4">
        <img
          src="/scroll.png"
          alt="Scroll instructions"
          className="w-[400px] rounded-lg shadow-lg border-4 border-yellow-800"
        />
      </div>

      <hr className="my-4 border-gray-300" />
      <p className="text-center italic">
        “To wield powerful spells, you must learn to craft your own using logic and
        structure!”
      </p>
      <p className="text-center mt-2">
        Try the <code>print()</code> spell to speak your magic aloud.
      </p>

      {/* Reference line (read-only) */}
      <div className="mt-4 max-w-3xl mx-auto">
        <div className="p-3 font-mono text-lg border rounded text-gray-400 select-none">
          {TARGET}
        </div>
      </div>

      {/* Player typing box (real input UNDER the reference) */}
      <div className="mt-3 max-w-3xl mx-auto">
        <label className="block text-sm text-gray-600 mb-1">Type your spell here:</label>
        <label className="block text-sm text-gray-600 mb-1">Type exactly:</label>
        <textarea
          rows={2}
          className="w-full font-mono text-lg p-3 border rounded outline-none focus:ring focus:ring-blue-200"
          placeholder='print("Hello there")'
          value={playerSpell}
          onChange={(e) => setPlayerSpell(e.target.value)}
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
        />
      </div>

      {/* Cast + error */}
      <div className="flex flex-col items-center mt-3">
        <button
          onClick={runCode}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cast Spell
        </button>
        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
      </div>

      {/* Blockly sandbox (no output console) */}
      <div className="flex justify-center mt-8">
        <div ref={blocklyDiv} className="h-96 w-2/3 border rounded-lg" />
      </div>
    </div>
  );
}
