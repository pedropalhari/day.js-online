import styled from "@emotion/styled";

import Editor from "@monaco-editor/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import OutputComponent from "../components/OutputComponent";
import { DAYJS_TYPES } from "./dayjs.types";
import { FaPlay } from "react-icons/fa";

if (typeof window !== "undefined") window.dayjs = dayjs;

const Root = styled.div`
  width: 100vw;
  height: 100vh;

  background-color: #222222;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
`;

const Logo = styled.span`
  color: white;
  font-weight: bold;
  margin-bottom: 32px;
  font-size: 32px;
  align-self: flex-start;

  span {
    font-weight: lighter;
    font-size: 16px;
  }
`;

const Container = styled.div`
  max-width: 700px;

  display: flex;
  flex-direction: column;

  .monaco-editor {
    border-radius: 6px;
    padding: 12px 0px;
    background-color: #1e1e1e;
  }

  .neon-button {
    border-radius: 6px;
    -webkit-box-shadow: 0px 0px 89px 17px rgba(204, 204, 204, 0.38);
    -moz-box-shadow: 0px 0px 89px 17px rgba(204, 204, 204, 0.38);
    box-shadow: 0px 0px 89px 17px rgba(204, 204, 204, 0.38);
  }
`;

const EditorContainer = styled.div`
  position: relative;
`;

const RunButton = styled.button`
  width: 100px;
  height: 32px;
  border-radius: 6px;
  background-color: #01b63622;
  background: linear-gradient(to right, rgb(182, 244, 146), rgb(51, 139, 147));
  color: white;
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;

  position: absolute;
  z-index: 999;
  top: -12px;
  right: -22px;
`;

const DEFAULT_CODE = `// The return of the function \`run\` will be printed.
// You can also run with Cmd/Ctrl + P.
function run(){
  return dayjs().add(2, "days").format("DD/MM/YYYY hh:mm A");
}`;

declare global {
  interface Window {
    dayjs: typeof dayjs;
  }
}

export default function Home() {
  const [currentEditorValue, setCurrentEditorValue] = useState(DEFAULT_CODE);
  const [lastRuns, setLastRuns] = useState<{ output: string; id: number }[]>(
    []
  );
  const [outputCounter, setOutputCounter] = useState(1);

  function runCode() {
    const result = eval(currentEditorValue + `;run();`);
    const resultJSON = JSON.stringify(result, null, 2);

    setLastRuns((l) => {
      if (l.length > 3) l.pop();

      l.unshift({ output: resultJSON, id: outputCounter });

      return [...l];
    });
    setOutputCounter((i) => i + 1);
  }

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (
        (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
        e.key === "p"
      ) {
        e.preventDefault();
        // Process the event here (such as click on submit button)
        runCode();
      }
    }

    document.addEventListener("keydown", handler, false);
    return () => {
      document.removeEventListener("keydown", handler, false);
    };
  }, [currentEditorValue, outputCounter]);

  useEffect(() => {
    runCode();
  }, []);

  return (
    <Root>
      <Container>
        <Logo>
          Day.js <br /> <span>@palhari</span>
        </Logo>

        <EditorContainer className="neon-button">
          <Editor
            onMount={(editor, monaco) => {
              editor.focus();
              editor.setPosition({
                lineNumber: 4,
                column: 61,
              });

              monaco.languages.typescript.typescriptDefaults.addExtraLib(
                DAYJS_TYPES,
                "ts:filename/dayjs.d.ts"
              );
            }}
            width="700px"
            height="200px"
            className="monaco-editor"
            theme="vs-dark"
            path={"index.ts"}
            defaultLanguage={"typescript"}
            defaultValue={DEFAULT_CODE}
            options={{
              lineNumbers: "off",
              tabSize: 2,
              bracketPairColorization: {
                enabled: true,
              },
              wordWrap: "on",
              fontSize: 16,
              minimap: {
                enabled: false,
              },
              colorDecorators: true,
              "semanticHighlighting.enabled": true,
            }}
            onChange={(value, ev) => {
              if (value) setCurrentEditorValue(value);
            }}
          />

          <RunButton onClick={() => runCode()}>
            Run <FaPlay size={10} />
          </RunButton>
        </EditorContainer>

        {lastRuns.map((lr) => (
          <OutputComponent key={Math.random()} value={lr.output} id={lr.id} />
        ))}
      </Container>
    </Root>
  );
}
