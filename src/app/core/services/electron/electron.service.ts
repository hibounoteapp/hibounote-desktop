import { Injectable } from '@angular/core';
import { BoardDataService } from '@shared-services/board-data/board-data.service';

@Injectable({
providedIn: 'root'
})
export class ElectronService {

  electron = (window as any).electron;
  constructor(protected boardData: BoardDataService) { }

  saveInDevice(value: string) {
    console.log('SAVING BOARDS!')
    this.electron.saveInDevice(value)
  }

  async getInDevice():Promise<string> {
    const data = await this.electron.getInDevice();
    return data;
  }

  deleteBoard(id: string) {
    this.electron.deleteBoard(id);
  }

  openLink(link: string) {
    this.electron.openLink(link);
  }
}
