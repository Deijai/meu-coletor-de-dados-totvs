import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public async setValue(key: string, value: any): Promise<void>{
    await Preferences.set({
      key: key,
      value: value,
    });
  };

  public async getValue(key: string): Promise<any>{
    return await Preferences.get({ key });
  };

  public async removeValue(key: string): Promise<void>{
    await Preferences.remove({ key });
  };
}
