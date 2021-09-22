import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface CardData {
  state: 'default' | 'flipped' | 'matched';
}

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-card-match',
  templateUrl: './card-match.component.html',
  styleUrls: ['./card-match.component.css'],
  animations: [
    trigger('cardFlip', [
      state('default', style({
        transform: 'none',
      })),
      state('flipped', style({
        transform: 'perspective(600px) rotateY(180deg)'
      })),
      state('matched', style({
        visibility: 'false',
        transform: 'scale(0.05)',
        opacity: 0
      })),
      transition('default => flipped', [
        animate('400ms')
      ]),
      transition('flipped => default', [
        animate('400ms')
      ]),
      transition('* => matched', [
        animate('400ms')
      ])
    ])
  ]
})
export class CardMatchComponent implements OnInit {

  retrievedUserSelections: any;
  userSelections: any;
  selectedSet: any;
  matchNum: any;
  cards: any;
  cardData: CardData = {
    state: 'default'
  };
  cardInfo: any;
  cardsArr: any[] = [];
  randomIdx: any;
  randomCard: any;
  flippedCards: any[] = [];
  cardStates: any;
  matchCount = 0;

  constructor(
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    this.retrievedUserSelections = localStorage.getItem('userSelections');
    this.userSelections = JSON.parse(this.retrievedUserSelections);
    this.selectedSet = this.userSelections.set;
    this.matchNum = this.userSelections.matchesNum;
    this.http.get(`https://api.pokemontcg.io/v2/cards?q=set.id:${this.selectedSet}`)
    .subscribe((data: any) => {
      this.cards = data.data;
      this.randomizeCards(this.cards, this.matchNum); 
      this.shuffleCards(this.cardsArr);
    })
  }

  randomizeCards(arr: any, num: number) {
    for (let i = 0; i < num; i++) {
      this.randomIdx = Math.floor(Math.random() * arr.length);
      this.randomCard = arr[this.randomIdx];
      this.cardsArr.push(this.randomCard);
      this.cardsArr.push({...this.randomCard});
    }
    for (let i = 0; i < this.cardsArr.length; i++) {
      this.cardsArr[i].state = 'default';
    }
  }

  shuffleCards(arr: any) {
    for (let i = arr.length - 1; i > 0; i--) {
        let x = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[x]] = [arr[x], arr[i]];
    }
}

  cardClicked(card: any) {
    if (card.state === 'default' && this.flippedCards.length < 3) {
      card.state = 'flipped';
      this.flippedCards.push(card);
      if (this.flippedCards.length > 1) {
        setTimeout(() => {this.checkForCardMatch()}, 1000);
      }
    } 
    else if (card.state === 'flipped') {
      card.state = 'default';
      this.flippedCards.pop();
    }
    
  }

  checkForCardMatch() {
    if (this.flippedCards[0].id === this.flippedCards[1].id) {
      this.flippedCards[1].state = 'matched';
      this.flippedCards[0].state = 'matched';
      this.flippedCards = [];
      this.matchCount++;
      if (this.matchCount === this.matchNum) {
        alert('All matches found! Game Over.');
      }
    } else {
      this.flippedCards[1].state = 'default';
      this.flippedCards[0].state = 'default';
      this.flippedCards = [];
    }
  }

}
