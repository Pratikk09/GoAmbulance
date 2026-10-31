import {SOCKET_URL} from '@rtkServices/endpoints';
import {getToken} from '@utils/general';
import {Socket, io} from 'socket.io-client';

export let socket: Socket | null = null;

async function socketService() {
  let {accessToken: token} = await getToken();

  socket = io(SOCKET_URL, {
    path: '/socket.io',
    forceNew: false,
    reconnectionAttempts: Infinity,
    timeout: 20000,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on('connect', () => {
    console.log('- socket connected -');
  });

  socket.on('disconnect', reason => {
    console.log(`socket disconnected reason - ${reason}`);
  });
}

function socketEmit(evt: string, data?: any) {
  socket?.emit(evt, data);
}

function socketListen(event: string, cb: any) {
  socket?.on(event, cb);
}

function socketDisconnect() {
  socket?.disconnect();
}

export {socketEmit, socketDisconnect, socketListen, socketService};
