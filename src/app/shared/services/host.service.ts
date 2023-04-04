import { Injectable } from '@angular/core';
import { Host } from '../interfaces/host.interface';
import { StorageService } from './storage.service';
import { NetworkService } from './network.service';
import { HttpClient } from '@angular/common/http';
import { StatusCodes } from 'http-status-codes';
import { Observable, pipe, lastValueFrom, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private host!: string;
  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private http: HttpClient,
  ) {
    this.init();
  }

  private async init() {
    await this.getHostToString();
  }

  public async test(host: Host): Promise<boolean> {
    this.host = this.decodeHost(host);

    console.log('this.host: ', this.host);
    

    const source$ = this.http.get<any>(`${this.host}/ping`).pipe(timeout(45000));
    return await lastValueFrom(source$)
      .then((res: Response) => {
        return true;
      })
      .catch((err: Response) => {
        if (err.status !== StatusCodes.UNAUTHORIZED) {
          return false;
        }
        return true;
      });
  }

  public async save(host: Host): Promise<Host> {
    console.log('save host ', host);
    
    return this.storageService
      .setValue('host', JSON.stringify(host))
      .then(() => {
        this.networkService.url = this.decodeHost(host);
        this.networkService.startListeningNetworkConnection();
        return host;
      })
      .catch(() => {
        throw new Error();
      });
  }

  public async getHostStorage(): Promise<Host> {
    return await this.storageService
      .getValue('host')
      .then((value: Host) => value);
  }
  public async getHostToString(): Promise<string> {
    return this.storageService
      .getValue('host')
      .then((value: Host) => (this.host = this.decodeHost(value)));
  }

  public get getHost(): string {
    return this.host;
  }
  public set setHost(host: string) {
    this.host = host;
  }

  public decodeHost(host: Host): string {
    if (host) {
      if (host.address.search('://')) {
        const addr = host.address.split('://').reverse();
        host.address = addr[0];
      }
      const currentPort = host.port ? ':' + host.port : '';
      const currentEndPoint = host.endpoint ? '/' + host.endpoint : '';
      return (
        host.protocol + '://' + host.address + currentPort + currentEndPoint
      );
    } else {
      return String(new Error('Erro no host'));
    }
  }
}
