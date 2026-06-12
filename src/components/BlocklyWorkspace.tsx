import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import { buildDocumentTree } from "../print-utils";
import type { DocumentTree, UploadedPhoto } from "../print-types";
import TOOLBOX from "../blockly-toolbox.json";
import BLOCKDEFS from "../blockly-definitions.json";

type BlocklyWorkspaceProps = {
  photos: UploadedPhoto[];
  onChange: (documentTree: DocumentTree, workspaceState: unknown) => void;
  ready: boolean;
  setReady: (ready: boolean) => void;
};

function createStarterWorkspace(workspace: Blockly.WorkspaceSvg) {
  const page = workspace.newBlock("page");
  page.initSvg();
  page.render();
  page.moveBy(24, 24);
}

function registerBlocks(photosRef: React.RefObject<UploadedPhoto[]>) {
  if (BLOCKDEFS.length > 0 && Blockly.Blocks[BLOCKDEFS[0].type]) {
    return;
  }

  Blockly.Extensions.register("dynamic_image_option_extension", function () {
    const field = this.getField("PICTURE");
    if (!field || !(field instanceof Blockly.FieldDropdown)) {
      throw new Error("PICTURE field not found or not a dropdown");
    }
    field.setOptions(photosRef.current.map((photo) => [photo.name, photo.url]));
  });

  Blockly.common.defineBlocksWithJsonArray(BLOCKDEFS);
}

export function BlocklyWorkspace({
  photos,
  onChange,
  ready,
  setReady,
}: BlocklyWorkspaceProps) {
  const blocklyContainerRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const photosRef = useRef<UploadedPhoto[]>(photos);

  useEffect(() => {
    registerBlocks(photosRef);
  }, []);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
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
      const documentTree = buildDocumentTree(workspace, photos);
      onChange(documentTree, Blockly.serialization.workspaces.save(workspace));
      setReady(true);
    };

    workspace.addChangeListener(handleWorkspaceChange);
    createStarterWorkspace(workspace);
    handleWorkspaceChange();

    return () => {
      workspace.removeChangeListener(handleWorkspaceChange);
      workspace.dispose();
      workspaceRef.current = null;
      setReady(false);
    };
  }, [onChange, photos, setReady]);

  useEffect(() => {
    const workspace = workspaceRef.current;

    if (!workspace) {
      return;
    }

    const documentTree = buildDocumentTree(workspace, photos);
    onChange(documentTree, Blockly.serialization.workspaces.save(workspace));
  }, [onChange, photos]);

  return (
    <section className="no-print overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur-lg">
      <div className="no-print flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Blockly workspace
          </h2>
          <p className="text-sm text-slate-400">
            Build a nested page tree from Page, container, picture, and loop
            blocks.
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
