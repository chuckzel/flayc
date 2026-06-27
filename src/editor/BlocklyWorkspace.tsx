import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import * as BlocklyEnLocale from "blockly/msg/en";
import { registerFieldColour } from "@blockly/field-colour";
import type { UploadedPhoto, WorkspaceState } from "../print-types";
import TOOLBOX from "./blockly-toolbox.json";
import BLOCKDEFS from "./blockly-definitions.json";

setupBlockly();

function setupBlockly() {
  Blockly.setLocale(BlocklyEnLocale as unknown as Record<string, string>);
  registerFieldColour();
  Blockly.common.defineBlocksWithJsonArray(BLOCKDEFS);
}

type BlocklyWorkspaceProps = {
  photos: UploadedPhoto[];
  state: {
    state: WorkspaceState | null;
    source: "load" | "user";
  };
  onChange: (workspaceState: WorkspaceState) => void;
};

function registerExtensions(photosRef: React.RefObject<UploadedPhoto[]>) {
  if (Blockly.Extensions.isRegistered("dynamic_image_option_extension")) return;
  Blockly.Extensions.register("dynamic_image_option_extension", function () {
    const field = this.getField("IMAGE");
    if (!field || !(field instanceof Blockly.FieldDropdown)) {
      throw new Error("IMAGE field not found or not a dropdown");
    }
    field.setOptions(() =>
      photosRef.current
        .map((photo) => [photo.name, photo.id] as [string, string])
        .concat([["None", "undefined"]]),
    );
  });
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

export function BlocklyWorkspace({
  photos,
  state,
  onChange,
}: BlocklyWorkspaceProps) {
  const blocklyContainerRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const photosRef = useRef<UploadedPhoto[]>(photos);

  useEffect(() => {
    registerExtensions(photosRef);

    const container = blocklyContainerRef.current;

    if (!container) {
      throw new Error("Blockly container not found");
    }
    const workspace = createWorkspace(container);
    workspaceRef.current = workspace;

    return () => {
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace || !state || state.source !== "load" || !state.state) {
      return;
    }
    Blockly.serialization.workspaces.load(state.state, workspace);
  }, [state]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) {
      return;
    }
    const handleWorkspaceChange = (e: Blockly.Events.Abstract) => {
      if (e.isUiEvent || workspace.isDragging()) {
        return;
      }
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
