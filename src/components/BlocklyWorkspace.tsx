import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import { readLayout, registerPrintBlocks } from "../print-utils";

type BlocklyWorkspaceProps = {
  onChange: (
    layout: ReturnType<typeof readLayout>,
    workspaceState: unknown,
  ) => void;
  ready: boolean;
  setReady: (ready: boolean) => void;
};

const TOOLBOX = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "category",
      name: "Layout",
      categorystyle: "math_category",
      contents: [{ kind: "block", type: "page_layout" }],
    },
    {
      kind: "category",
      name: "Picture Rules",
      categorystyle: "text_category",
      contents: [{ kind: "block", type: "photo_placement" }],
    },
    {
      kind: "category",
      name: "Text",
      categorystyle: "text_category",
      contents: [{ kind: "block", type: "text" }],
    },
    {
      kind: "category",
      name: "Math",
      categorystyle: "math_category",
      contents: [{ kind: "block", type: "math_number" }],
    },
  ],
};

export function BlocklyWorkspace({
  onChange,
  ready,
  setReady,
}: BlocklyWorkspaceProps) {
  const blocklyContainerRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    registerPrintBlocks();

    const container = blocklyContainerRef.current;

    if (!container) {
      return;
    }

    const workspace = Blockly.inject(container, {
      toolbox: TOOLBOX,
      grid: {
        spacing: 24,
        length: 3,
        colour: "#334155",
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.95,
        maxScale: 1.5,
        minScale: 0.6,
        scaleSpeed: 1.1,
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
    });

    workspaceRef.current = workspace;

    const handleWorkspaceChange = () => {
      onChange(
        readLayout(workspace),
        Blockly.serialization.workspaces.save(workspace),
      );
      setReady(true);
    };

    workspace.addChangeListener(handleWorkspaceChange);

    if (workspace.getTopBlocks(false).length === 0) {
      const layoutBlock = workspace.newBlock("page_layout");
      layoutBlock.initSvg();
      layoutBlock.render();
      layoutBlock.moveBy(32, 32);

      const placementBlock = workspace.newBlock("photo_placement");
      placementBlock.initSvg();
      placementBlock.render();
      placementBlock.moveBy(32, 160);
      layoutBlock.nextConnection?.connect(placementBlock.previousConnection!);
    }

    handleWorkspaceChange();

    return () => {
      workspace.removeChangeListener(handleWorkspaceChange);
      workspace.dispose();
      workspaceRef.current = null;
      setReady(false);
    };
  }, [onChange, setReady]);

  return (
    <section className="no-print overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur-lg">
      <div className="no-print flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Blockly workspace
          </h2>
          <p className="text-sm text-slate-400">
            Use blocks to describe paper size, margins, and the general print
            flow.
          </p>
        </div>
        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
          {ready ? "Ready" : "Loading"}
        </div>
      </div>
      <div ref={blocklyContainerRef} className="h-[760px] w-full" />
    </section>
  );
}
