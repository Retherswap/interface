export class Api {
  public fetcher = (address: string) => fetch(address).then((res) => res.json());
}
