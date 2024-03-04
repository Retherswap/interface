import { io } from 'socket.io-client';
import { serverUrl } from './server';

const socket = io(serverUrl);

export default socket;
