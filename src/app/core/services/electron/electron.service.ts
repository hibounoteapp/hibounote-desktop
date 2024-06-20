import { Injectable } from '@angular/core';
import { BoardDataService } from '@shared-services/board-data/board-data.service';

@Injectable({
providedIn: 'root'
})
export class ElectronService {

  constructor(protected boardData: BoardDataService) { }

  saveInDevice(value: string) {
    console.log('SAVING BOARDS!')
    const electron = (window as any).electron;
    electron.saveInDevice(value)
  }

  async getInDevice():Promise<string> {
    const electron = (window as any).electron;
    const data = await electron.getInDevice();
    return data;
  }
}
