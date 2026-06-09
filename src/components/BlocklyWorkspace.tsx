import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import {
  buildDocumentTree,
  registerPrintBlocks,
  setAvailablePhotoOptions,
} from "../print-utils";
import type { DocumentTree, UploadedPhoto } from "../print-types";

type BlocklyWorkspaceProps = {
  photos: UploadedPhoto[];
  onChange: (documentTree: DocumentTree, workspaceState: unknown) => void;
  ready: boolean;
  setReady: (ready: boolean) => void;
};

const TOOLBOX = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "category",
      name: "Page",
      colour: "210",
      contents: [{ kind: "block", type: "print_page" }],
    },
    {
      kind: "category",
      name: "Containers",
      colour: "190",
      contents: [
        { kind: "block", type: "print_margins" },
        { kind: "block", type: "print_border" },
        { kind: "block", type: "print_size" },
        { kind: "block", type: "print_flex" },
      ],
    },
    {
      kind: "category",
      name: "Content",
      colour: "28",
      contents: [
        { kind: "block", type: "print_picture" },
        { kind: "block", type: "print_foreach" },
      ],
    },
  ],
};

function connectStatement(
  parent: Blockly.Block,
  inputName: string,
  child: Blockly.Block,
) {
  const input = parent.getInput(inputName);
  const connection = input?.connection;

  if (!connection || !child.previousConnection) {
    return;
  }

  connection.connect(child.previousConnection);
}

function createStarterWorkspace(
  workspace: Blockly.WorkspaceSvg,
  photos: UploadedPhoto[],
) {
  const page = workspace.newBlock("print_page");
  page.initSvg();
  page.render();
  page.moveBy(24, 24);

  const margins = workspace.newBlock("print_margins");
  margins.initSvg();
  margins.render();
  margins.moveBy(40, 96);
  connectStatement(page, "CONTENT", margins);

  const border = workspace.newBlock("print_border");
  border.initSvg();
  border.render();
  border.moveBy(56, 168);
  connectStatement(margins, "CONTENT", border);

  const flex = workspace.newBlock("print_flex");
  flex.initSvg();
  flex.render();
  flex.moveBy(72, 240);
  connectStatement(border, "CONTENT", flex);

  const picture = workspace.newBlock("print_picture");
  picture.initSvg();
  picture.render();
  picture.moveBy(96, 312);
  connectStatement(flex, "CONTENT", picture);

  const foreach = workspace.newBlock("print_foreach");
  foreach.initSvg();
  foreach.render();
  foreach.moveBy(96, 456);
  connectStatement(flex, "CONTENT", foreach);

  const size = workspace.newBlock("print_size");
  size.initSvg();
  size.render();
  size.moveBy(112, 528);
  connectStatement(foreach, "CONTENT", size);

  const loopPicture = workspace.newBlock("print_picture");
  loopPicture.initSvg();
  loopPicture.render();
  loopPicture.moveBy(128, 600);
  connectStatement(size, "CONTENT", loopPicture);

  const firstPhotoId = photos[0]?.id ?? "__current__";
  picture.setFieldValue(firstPhotoId, "PHOTO_ID");
  loopPicture.setFieldValue("__current__", "PHOTO_ID");
}

function syncPictureOptions(
  workspace: Blockly.WorkspaceSvg,
  photos: UploadedPhoto[],
) {
  setAvailablePhotoOptions(photos);
  const validIds = new Set(["__current__", ...photos.map((photo) => photo.id)]);
  const fallbackPhotoId = photos[0]?.id ?? "__current__";

  workspace
    .getAllBlocks(false)
    .filter((block) => block.type === "print_picture")
    .forEach((block) => {
      const currentValue = block.getFieldValue("PHOTO_ID");
      if (!validIds.has(currentValue)) {
        block.setFieldValue(fallbackPhotoId, "PHOTO_ID");
      }
    });
}

export function BlocklyWorkspace({
  photos,
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
    syncPictureOptions(workspace, photos);

    const handleWorkspaceChange = () => {
      const documentTree = buildDocumentTree(workspace, photos);
      onChange(documentTree, Blockly.serialization.workspaces.save(workspace));
      setReady(true);
    };

    workspace.addChangeListener(handleWorkspaceChange);

    if (
      workspace
        .getTopBlocks(false)
        .every((block) => block.type !== "print_page")
    ) {
      createStarterWorkspace(workspace, photos);
    }

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

    syncPictureOptions(workspace, photos);
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
