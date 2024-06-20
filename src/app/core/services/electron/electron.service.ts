import { Injectable } from '@angular/core';
import { BoardDataService } from '@shared-services/board-data/board-data.service';

@Injectable({
providedIn: 'root'
})
export class ElectronService {

  constructor(protected boardData: BoardDataService) { }

  saveInDevice() {
    console.log("saving...")
    const electron = (window as any).electron;
    electron.saveInDevice(JSON.stringify(this.boardData.boards))
  }

  async getInDevice():Promise<string> {
    const electron = (window as any).electron;
    const data = await electron.getInDevice();
    console.log(data)
    return data;
  }
}
