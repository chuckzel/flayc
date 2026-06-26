import { createContext } from "react";
import type { UploadedPhoto } from "../print-types";

export const DocumentContext = createContext({
  assets: [] as UploadedPhoto[],
});
