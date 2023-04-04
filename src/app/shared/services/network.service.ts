import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Observable, pipe, lastValueFrom } from 'rxjs';
import { StatusCodes } from 'http-status-codes';

declare var navigator: any;

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  public connectionSubject: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  private platformObserver!: any;
  public isConnected: boolean = false;
  public url = 'https://mingle.totvs.com.br/api/test';
  constructor(private http: HttpClient, private platform: Platform) {}

  set getUrl(url: string) {
    this.url = url + '/ping';
  }
  get setUrl() {
    return this.url;
  }

  private subscribeNetworkChanges() {
    if (window.hasOwnProperty('cordova')) {
      this.changeConnectionMobile();
    } else {
      navigator['connection'].addEventListener('change', () =>{
        console.log('aquiiii');
        
        this.pingToUrl();
      });
    }
  }

  async startListeningNetworkConnection(): Promise<void> {
    if (this.platformObserver) {
      try {
        this.platformObserver.unsubscribe();
      } catch (error) {
        console.info(error);
      }
    } else {
      this.connectionSubject = new BehaviorSubject(false);
    }
    this.platformObserver = this.platform.resume.subscribe(() => {
      this.startListeningNetworkConnection();
    });
    this.retryPingToUrl();
  }

  private async retryPingToUrl(): Promise<any> {
    const source$ = this.http.get<any>(this.url);
    return await lastValueFrom(source$)
      .then((res) => {
        this.isConnected = true;

        this.connectionSubject.next(true);
        this.subscribeNetworkChanges();
      })
      .catch(error => {
        if (error.status === StatusCodes.UNAUTHORIZED) {
            this.isConnected = true;
            this.connectionSubject.next(true);
        } else {
            this.isConnected = false;
            this.connectionSubject.next(false);
        }

        this.subscribeNetworkChanges();
    },);
  }

  public async changeConnectionMobile() {
    const status = await Network.getStatus();

    if (status.connected === false) {
      this.isConnected = false;
      this.connectionSubject.next(false);
    } else {
      this.pingToUrl();
    }

    console.log('Network status:', status);
  }
  private async pingToUrl(): Promise<any> {
    const source$ = this.http.get<any>(this.url).pipe(delay(1000));
    return await lastValueFrom(source$)
      .then((res) => {
        this.isConnected = true;
        this.connectionSubject.next(true);
      })
      .catch((error) => {
        if (error.status === StatusCodes.UNAUTHORIZED) {
          this.isConnected = true;
          this.connectionSubject.next(true);
        } else {
          this.isConnected = false;
          this.connectionSubject.next(false);
        }
      });
  }
}
