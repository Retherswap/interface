import { QueryClient } from 'react-query';
import { Socket } from 'socket.io-client';

export class RetherswapApi {
  protected queryClient?: QueryClient;
  private handlers = new Map<string, { count: number; handler: (data: any) => void }>();
  protected socket?: Socket;

  public init(queryClient: QueryClient, socket: Socket) {
    this.queryClient = queryClient;
    this.socket = socket;
  }

  public subscribeSocketChannel(channel: string, callback: (data: any) => void) {
    const handler = this.handlers.get(channel);
    if (handler) {
      ++handler.count;
      return;
    }
    this.socket?.on(channel, callback);
    this.handlers.set(channel, { count: 1, handler: callback });
  }

  public unsubscribeChannel(channel: string) {
    const handler = this.handlers.get(channel);
    if (!handler) {
      return;
    }
    --handler.count;
    if (handler.count === 0) {
      this.socket?.off(channel, handler.handler);
      this.handlers.delete(channel);
    }
  }
}
