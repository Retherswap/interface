import { apiUrl } from 'configs/server';
import { Socket } from 'socket.io-client';
import { formatNumber } from './formatNumber';
import { Token } from 'models/schema';
import {
  ResolutionString,
  ErrorCallback,
  GetMarksCallback,
  HistoryCallback,
  IExternalDatafeed,
  OnReadyCallback,
  LibrarySymbolInfo,
  Mark,
  PeriodParams,
  ResolveCallback,
  SearchSymbolsCallback,
  SymbolResolveExtension,
  DatafeedConfiguration,
  IDatafeedChartApi,
  SubscribeBarsCallback,
} from './trading-view/charting_library';
export class RetherswapDataFeed implements IExternalDatafeed, IDatafeedChartApi {
  //private channelToSubscription = new Map();
  //private lastBar: Bar | undefined;
  private resolutions: { [key: ResolutionString]: { resolution: string } } = {
    /*'1S': { resolution: '1 second' },
    '1': { resolution: '1 min' },
    '5': { resolution: '5 min' },
    '30': { resolution: '30 min' },*/
    '60': { resolution: '1 hours' },
    '240': { resolution: '4 hours' },
    '360': { resolution: '6 hours' },
    '720': { resolution: '12 hours' },
    '1D': { resolution: '1 day' },
    '1W': { resolution: '1 week' },
    '1M': { resolution: '1 month' },
  } as any;
  private timeResolution: ResolutionString = '1D' as ResolutionString;

  public constructor(
    public socket: Socket,
    private token: Token,
    private nativeToken: Token,
    private address: string | null | undefined
  ) {}

  public getConfig(): DatafeedConfiguration {
    return {
      supported_resolutions: Object.keys(this.resolutions) as ResolutionString[],
      supports_marks: true,
    };
  }

  public parseFullSymbol(fullSymbol) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
      return null;
    }
    return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
  }

  getNextBarTime(tradeTime, barTime) {
    const date = new Date(barTime * 1000);
    if (this.timeResolution === '1T') {
      return new Date(tradeTime * 1000).getTime() / 1000;
    } else if (this.timeResolution === '1') {
      date.setMinutes(date.getMinutes() + 1);
    } else if (this.timeResolution === '5') {
      date.setMinutes(date.getMinutes() + 5);
    } else if (this.timeResolution === '30') {
      date.setMinutes(date.getMinutes() + 30);
    } else if (this.timeResolution === '60') {
      date.setHours(date.getHours() + 1);
    } else if (this.timeResolution === '6H') {
      date.setHours(date.getHours() + 6);
    } else if (this.timeResolution === '12H') {
      date.setHours(date.getHours() + 12);
    } else if (this.timeResolution === '1D') {
      date.setDate(date.getDate() + 1);
    } else if (this.timeResolution === '4D') {
      date.setDate(date.getDate() + 1);
    } else if (this.timeResolution === '1W') {
      date.setDate(date.getDate() + 7);
    } else if (this.timeResolution === '1M') {
      date.setMonth(date.getMonth() + 1);
    }
    return date.getTime() / 1000;
  }

  public onReady(callback: OnReadyCallback): void {
    setTimeout(() => callback(this.getConfig()));
  }

  public async getMarks(
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<Mark>,
    resolution: ResolutionString
  ) {
    if (!this.address) {
      return;
    }
    const urlParameters = {
      resolution: this.resolutions[resolution].resolution,
      from: from,
      to: to,
    };
    const query = Object.keys(urlParameters)
      .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join('&');
    let data = await fetch(`${apiUrl}/chart/transactions/${this.address}/${symbolInfo.ticker}?${query}`).then((res) =>
      res.json()
    );
    const spacing = '\u200A'.repeat(200);
    onDataCallback(
      data.map((transaction) => {
        return {
          id: transaction.id,
          time: Math.floor(new Date(transaction.bucket).getTime() / 1000),
          color: transaction.isBuy ? 'green' : 'red',
          text: `${transaction.isBuy ? 'Buy' : 'Sell'}\u00A0at\u00A0${new Date(transaction.bucket)
            .toLocaleString()
            .replace(' ', '\u00A0')}${spacing}
          Price\u00A0$${formatNumber(
            transaction.isBuy ? transaction.totalOutputUsd : transaction.totalInputUsd
          )}${spacing}
          Current\u00A0value\u00A0$${formatNumber(
            Number(transaction.isBuy ? transaction.totalOutput : transaction.totalInput) *
              Number(this.token.nativeQuote) *
              Number(this.nativeToken.usdPrice)
          )}${spacing}`,
          label: ' ',
          labelFontColor: 'blue',
          minSize: 1,
        };
      })
    );
  }

  public async searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback) {
    const data = await fetch(`${apiUrl}/chart/symbols?search=${userInput}`).then((res) => res.json());
    onResult(
      data.map((symbol) => {
        return {
          ticker: symbol.ticker,
          full_name: symbol.ticker,
          symbol: symbol.symbol,
          description: symbol.ticker,
          exchange: exchange,
          type: 'crypto',
        };
      })
    );
  }

  public getPriceScale(lastPrice: number): number {
    if (lastPrice >= 1) {
      return 100;
    }
    const stringValue = lastPrice.toString();
    const decimalIndex = stringValue.indexOf('.');
    if (decimalIndex === -1) {
      return 1;
    }
    const decimalPart = stringValue.slice(decimalIndex + 1);
    let firstNumber = 0;
    while (decimalPart.length > firstNumber && decimalPart[firstNumber] === '0') {
      ++firstNumber;
    }
    return Math.pow(10, firstNumber + 2);
  }

  public async resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback,
    extension?: SymbolResolveExtension | undefined
  ) {
    const data = await fetch(`${apiUrl}/chart/symbols/${symbolName}`).then((res) => res.json());
    const symbolInfo: LibrarySymbolInfo = {
      name: data.ticker,
      description: data.ticker,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: 'retherswap.org',
      listed_exchange: 'retherswap.org',
      format: 'price',
      minmov: 1,
      pricescale: this.getPriceScale(data.price),
      has_intraday: true,
      visible_plots_set: 'ohlcv',
      has_weekly_and_monthly: true,
      volume_precision: 2,
    };
    onResolve(symbolInfo);
  }

  public async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) {
    const { from, to, countBack } = periodParams;
    try {
      const urlParameters = {
        resolution: this.resolutions[resolution].resolution,
        from: from,
        to: to,
        countBack: countBack,
      };
      const query = Object.keys(urlParameters)
        .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
        .join('&');
      let data = await fetch(`${apiUrl}/chart/prices/${symbolInfo.ticker}?${query}`).then((res) => res.json());
      if (data.noData) {
        onResult([], { noData: data.noData });
        return;
      }
      data = data.map((bar) => {
        return {
          time: parseInt(bar.time),
          low: bar.low,
          high: bar.high,
          open: bar.open,
          close: bar.close,
          volume: Number(bar.volume),
        };
      });
      onResult(data);
    } catch (error) {
      console.log('[getBars]: Get error', error);
    }
  }

  /*public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ): void {
    const parsedSymbol = this.parseFullSymbol(`${symbolInfo.exchange}:${symbolInfo.name}`);
    if (!parsedSymbol) {
      return;
    }
    const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
    this.socket.on(channelString, (data) => {
      console.log('[socket] Message:', data);
      const [eventTypeStr, fromSymbol, toSymbol, , , tradeTimeStr, , tradePriceStr] = data.split('~');
      if (parseInt(eventTypeStr) !== 0) {
        return;
      }
      const tradePrice = parseFloat(tradePriceStr);
      const tradeTime = parseInt(tradeTimeStr);
      const channelString = `0~${fromSymbol}~${toSymbol}`;
      const subscriptionItem = this.channelToSubscription.get(channelString);
      if (subscriptionItem === undefined) {
        return;
      }
      const lastBar = subscriptionItem.lastBar;
      const nextDailyBarTime = this.getNextBarTime(tradeTime, lastBar.time);
      let bar: Bar;
      if (tradeTime >= nextDailyBarTime) {
        bar = {
          time: nextDailyBarTime,
          open: tradePrice,
          high: tradePrice,
          low: tradePrice,
          close: tradePrice,
        };
        console.log('[socket] Generate new bar', bar);
      } else {
        bar = {
          ...lastBar,
          high: Math.max(lastBar.high, tradePrice),
          low: Math.min(lastBar.low, tradePrice),
          close: tradePrice,
        };
        console.log('[socket] Update the latest bar by price', tradePrice);
      }
      console.log('[socket] Update the latest bar by price', tradePrice);
      subscriptionItem.lastBar = bar;
      subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
    });
    this.channelToSubscription.set(listenerGuid, channelString);
    console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
  }

  public unsubscribeBars(listenerGuid: string): void {
    const channelString = this.channelToSubscription.get(listenerGuid);
    if (channelString === undefined) {
      return;
    }
    this.socket.off(channelString);
    this.channelToSubscription.delete(listenerGuid);
    console.log('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString);
  }*/

  public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ): void {
    throw new Error('Method not implemented.');
  }
  public unsubscribeBars(listenerGuid: string): void {
    throw new Error('Method not implemented.');
  }
}
