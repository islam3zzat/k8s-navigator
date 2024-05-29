import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerPKG } from "@electron-forge/maker-pkg";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import * as dotenv from "dotenv";
import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

dotenv.config();

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "./src/images/icon",
    osxSign: {
      identity: process.env.SIGN_ID,
      // @ts-expect-error unknown property
      hardenedRuntime: true,
      entitlements: "./config/entitlements.plist",
      "entitlements-inherit": "./config/entitlements.plist",
      "gatekeeper-assess": false,
    },
    osxNotarize: {
      appleApiKey: process.env.APPLE_API_KEY as string,
      appleApiKeyId: process.env.APPLE_API_KEY_ID as string,
      appleApiIssuer: process.env.APPLE_API_ISSUER as string,
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
    new MakerPKG({
      identity: process.env.INSTALLER_ID as string,
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-gcs",
      config: {
        storageOptions: {
          projectId: process.env.GCLOUD_PROJECT as string,
        },
        bucket: "k8s-navigator-bucket",
        folder: "release",
        public: true,
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
