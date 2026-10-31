import {SOCKET_URL} from '@rtkServices/endpoints';
import {getToken} from '@utils/general';
import {Socket, io} from 'socket.io-client';

export let socket: Socket | null = null;

async function socketService() {
  let {accessToken: token} = await getToken();
  socketDisconnect();

  // The server joins this socket to `user:<userId>` from the token.
  socket = io(SOCKET_URL, {
    path: '/socket.io',
    transports: ['websocket'],
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 20000,
    auth: {token},
  });

  socket.on('connect', () => {
    console.log('- socket connected -');
  });

  socket.on('connect_error', error => {
    console.log(`socket connect error - ${error.message}`);
  });

  socket.on('disconnect', reason => {
    console.log(`socket disconnected reason - ${reason}`);
  });
}

function socketEmit(evt: string, data?: any, ack?: (res: any) => void) {
  socket?.emit(evt, data, ack);
}

function socketListen(event: string, cb: any) {
  socket?.on(event, cb);
}

function socketDisconnect() {
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = null;
}

export {socketEmit, socketDisconnect, socketListen, socketService};
