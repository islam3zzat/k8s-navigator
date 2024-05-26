#!/bin/bash

APP_NAME="k8s-navigator"

yarn run package

DMG_NAME="${APP_NAME}.dmg"

# Detect architecture (x64 or arm64)
ARCHITECTURE=$(uname -m)
if [[ "$ARCHITECTURE" == "x86_64" ]]; then
  PLATFORM="darwin-x64"
elif [[ "$ARCHITECTURE" == "arm64" ]]; then
  PLATFORM="darwin-arm64"
else
  echo "Unsupported architecture: $ARCHITECTURE"
  exit 1
fi

hdiutil create -volname "$APP_NAME" -srcfolder "out/$APP_NAME-$PLATFORM/$APP_NAME.app" -ov -format UDZO "$DMG_NAME"

echo "DMG created for $ARCHITECTURE: $DMG_NAME"
