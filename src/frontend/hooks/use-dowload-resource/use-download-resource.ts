import { useCallback } from "react";
import * as yaml from "js-yaml";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDownloadResource = (name: string, resource: any) => {
  return useCallback(() => {
    if (!resource) return;
    const yamlString = yaml.dump(resource);
    const blob = new Blob([yamlString], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.yaml`;
    a.click();

    URL.revokeObjectURL(url);
  }, [name, resource]);
};
