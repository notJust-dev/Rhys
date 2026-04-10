# Known Issues

## expo-dev-client pinned to 55.0.24

`expo-dev-client` is pinned to `55.0.24` to avoid an iOS build failure introduced in `expo-dev-launcher@55.0.26`. That version removed the `appBridge` property from `EXDevLauncherController.h` but still references it in the implementation file, causing a compile error.

Pinning to `55.0.24` resolves to `expo-dev-launcher@55.0.25` which is the last working version.

**Tracking issue:** https://github.com/expo/expo/issues/44677

Remove the pin once the upstream fix is released.
