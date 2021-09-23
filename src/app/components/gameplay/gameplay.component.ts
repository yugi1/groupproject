import { Component, OnInit } from '@angular/core';
import { TimerComponent } from './timer/timer.component';
import { CardMatchComponent } from './card-match/card-match.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.css']
})
export class GameplayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //when timer hits 0, change currentPlayer to next player in array of players
  //increment matched cards number to currentPlayer's score
  //create a 'rounds' variable that increments when each player has had a turn--make a 
  //number of player's turns variable and increment it when they become currentPlayer

}