import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private _theme: 'light' | 'dark' = 'light';
  public get theme(): 'light' | 'dark' {
    return this._theme;
  }
  public set theme(value: 'light' | 'dark') {
    localStorage.setItem('theme',value);
    this._theme = value;
  }

  constructor(){
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) {
      if(savedTheme === 'light' || savedTheme === 'dark')
        this.theme = savedTheme;
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}
