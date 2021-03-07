import WebSocket from 'ws';
import { MiddlewareAPI } from 'redux';
import * as jsondiffpatch from 'jsondiffpatch';
import {GroupsState} from '@morten-olsen/rolighed-common';

class SocketClient {
  private _socket: WebSocket;
  private _store: MiddlewareAPI;
  private _state: GroupsState

  constructor(socket: WebSocket, store: MiddlewareAPI) {
    this._socket = socket;
    this._store = store;
    this._state = store.getState();
    socket.onmessage = this._onmessage;
    this._setup();
  }

  private _setup = () => {
    this._send('core/setup', {
      state: this._state,
    });
  };

  private _onmessage = ({ data }: WebSocket.MessageEvent) => {
    const msg = JSON.parse(data.toString());
    switch (msg.type) {
      case 'dispatch': {
        this._store.dispatch(msg.payload);
      }
    }
  };

  private _send = (type: string, payload: any) => {
    this._socket.send(JSON.stringify({
      type,
      payload,
    }));
  };

  public updateState = (action: any) => {
    const next = this._store.getState();
    const diff = jsondiffpatch.diff(next, this._state);
    this._send('state/partial', {
      diff,
      action,
    });
    this._store = next;
  };
}

export default SocketClient;
