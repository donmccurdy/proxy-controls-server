# Proxy Controls Server

Service to proxy keyboard/gamepad controls between devices, peer-to-peer, over WebRTC.

This component should be used in the *controller* application, to receive UI events from a keyboard/gamepad/leap device and forward them to a *viewer* application. Your viewer application should use [aframe-proxy-controls](https://github.com/donmccurdy/aframe-proxy-controls), or your own implementation.

## Notes

Two optional dependencies for `ws`, `bufferutil` and `utf-8-validate`, are included. [Both improve performance in certain conditions](https://github.com/websockets/ws#opt-in-for-performance).
