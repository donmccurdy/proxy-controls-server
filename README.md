# Proxy Controls Server

![Status](https://img.shields.io/badge/status-experimental-orange.svg)
[![License](https://img.shields.io/badge/license-MIT-007ec6.svg)](https://github.com/donmccurdy/proxy-controls-server/blob/master/LICENSE)

Service to proxy keyboard/gamepad controls between devices, peer-to-peer, over WebRTC.

## Overview

```
.
├── client
│   ├── assets
│   ├── controllers
│   ├── lib
│   ├── services
│   └── views
└── server
```

## Dependencies

This project relies on the [SocketPeer](https://github.com/cvan/socketpeer) library to manage WebRTC and WebSocket connections.

## Notes

Two optional dependencies for `ws`, `bufferutil` and `utf-8-validate`, are included. [Both improve performance in certain conditions](https://github.com/websockets/ws#opt-in-for-performance).
