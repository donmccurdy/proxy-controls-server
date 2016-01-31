# Proxy Controls Server

Service to proxy keyboard/gamepad controls between devices, peer-to-peer, over WebRTC.

See: [https://proxy-controls.donmccurdy.com](https://proxy-controls.donmccurdy.com).

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
