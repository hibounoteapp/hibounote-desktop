import { Injectable } from '@angular/core';
import { Board } from '@custom-interfaces/board';
import { BoardDataService } from '@shared-services/board-data/board-data.service';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {


  filteredBoards: Board[] = this.boardData.boards;


  constructor(protected boardData: BoardDataService) { }

  public filter(input: string) {
    if(input === '') {
      this.filteredBoards = this.boardData.boards
      return
    }
    const boards = [...this.boardData.boards];
    const newBoards = boards.filter((board)=>board.name.includes(input))
    this.filteredBoards = newBoards;
  }

  setSearch(event: Event, input: string) {
    if(event.target instanceof HTMLInputElement)
    input = event.target.value;
    this.filter(input);
  }
}
