import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import { registerFieldColour } from "@blockly/field-colour";
import type { UploadedPhoto, WorkspaceState } from "../print-types";
import TOOLBOX from "../blockly-toolbox.json";
import BLOCKDEFS from "../blockly-definitions.json";

type BlocklyWorkspaceProps = {
  photos: UploadedPhoto[];
  onChange: (workspaceState: WorkspaceState) => void;
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

  registerFieldColour();
  Blockly.Extensions.register("dynamic_image_option_extension", function () {
    const field = this.getField("IMAGE_URL");
    if (!field || !(field instanceof Blockly.FieldDropdown)) {
      throw new Error("IMAGE_URL field not found or not a dropdown");
    }
    field.setOptions(() =>
      photosRef.current.map((photo) => [photo.name, photo.url]),
    );
  });

  Blockly.common.defineBlocksWithJsonArray(BLOCKDEFS);
}

function createWorkspace(container: HTMLDivElement) {
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

  return workspace;
}

export function BlocklyWorkspace({ photos, onChange }: BlocklyWorkspaceProps) {
  const blocklyContainerRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const photosRef = useRef<UploadedPhoto[]>(photos);

  useEffect(() => {
    registerBlocks(photosRef);

    const container = blocklyContainerRef.current;

    if (!container) {
      throw new Error("Blockly container not found");
    }
    const workspace = createWorkspace(container);
    workspaceRef.current = workspace;
    createStarterWorkspace(workspace);

    return () => {
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, []);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) {
      return;
    }
    const handleWorkspaceChange = () => {
      onChange(
        Blockly.serialization.workspaces.save(workspace) as WorkspaceState,
      );
    };

    workspace.addChangeListener(handleWorkspaceChange);

    return () => {
      workspace.removeChangeListener(handleWorkspaceChange);
    };
  }, [onChange]);

  return (
    <section className="no-print overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur-lg">
      <div ref={blocklyContainerRef} className="h-[760px] w-full" />
    </section>
  );
}
