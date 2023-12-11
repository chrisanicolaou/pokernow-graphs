import { Injectable } from '@angular/core';
import { GameContext } from "../interfaces/game-context.model";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { Hand } from "../interfaces/hand.model";
import { Round } from "../interfaces/round.model";
import { Player } from "../interfaces/player.model";
import { LoadingState } from "../enums/loading-state.enum";

@Injectable({
  providedIn: 'root'
})
export class GameContextService {
  gameContextSubject = new ReplaySubject<GameContext>(1);
  gameContextLoadingSubject = new ReplaySubject<LoadingState>(1);
  private _gameContext: GameContext = {
    players: [],
    hands: []
  }
  constructor() { }

  loadFileToGameContext(file: File) {
    this.gameContextLoadingSubject.next(LoadingState.Loading);
    file.text().then(res => {
      let fileArr = res.split("\n").reverse();

      // First, find and store all players.
      fileArr.filter(line => line.includes("joined")).forEach(line => {
        let lineAsWords = line.split(" ");
        let indexPrecedingPlayerId = lineAsWords.indexOf("@");
        // We slice off the first 2 (or last 2) characters from the name/id respectively to clean up the additional quotation marks.
        let id = lineAsWords[indexPrecedingPlayerId + 1].slice(0, -2);
        if (this._gameContext.players.some(player => player.id === id)) return;
        this._gameContext.players.push({
          name: lineAsWords[indexPrecedingPlayerId - 1].slice(2),
          id: id,
          profitLoss: 0
        });
      });

      // Then find and store all the hands
      fileArr.filter((line) => line.includes("starting hand")).map((line, handIndex) => {
        let hand: Hand = {
          index: handIndex,
          players: this.generatePlayersFromGameContext()
        };
        let round: Round = this.generateRound();
        // There are consistently 2 lines of info we don't care about at the start of each hand - skip over these
        let rowIndex = fileArr.indexOf(line) + 2;
        while (true) {
          // We're at the start of the hand and need to traverse to the end of the hand to determine the outcome of the hand
          let currentAction = fileArr[rowIndex];

          // Not really sure why we're sometimes still in this loop when we hit the end of the file, making currentAction undefined :/ need to investigate
          if (!currentAction) return;

          if (currentAction.includes("ending hand")) break;

          if (currentAction.includes("Flop") || currentAction.includes("Turn") || currentAction.includes("River")) {
            round = this.generateRound();
          }

          this.parseCurrentAction(currentAction, hand, round);
          rowIndex++;
        }
        this._gameContext.hands.push(hand);
        this._gameContext.players.forEach(player => {
          player.profitLoss += hand.players.find(handPlayer => player.id === handPlayer.id)?.profitLoss ?? 0;
        })
      });

      this.gameContextSubject.next(this._gameContext);
      this.gameContextLoadingSubject.next(LoadingState.Loaded);
    });
  }

  // POSSIBLE RESULTS:
  //// - Player posts a small blind
  //// - Player posts a big blind
  //// - Player posts a straddle
  //// - Player calls
  //// - Player raises
  //// - Player folds
  //// - Player checks
  //// - Player collected X from pot
  //// - Player posts a big blind
  //// - Uncalled bet of X returned to player
  //// - Dead blind
  private parseCurrentAction(currentAction: string, hand: Hand, round: Round) {
    // First find the target player. If there is none, this is an "info row" (i.e. what cards showed on the flop), and we should ignore.
    let playerIndex = hand.players.findIndex(player => currentAction.includes(player.id));
    if (playerIndex < 0) return;

    // Some info rows include player stacks (i.e if someone joins, stands, quits). We should ignore these also.
    if (currentAction.includes("stack of") || currentAction.includes("Player stacks")) return;

    // Next we find the amount. If there is no amount, this is a check, fold, or otherwise another info role, and we should ignore.
    let amount = this.extractAmountFromAction(currentAction);
    if (amount == null) return;

    // The only 2 instances where an amount should be added to a player are if they are collecting from pot, or being returned their uncalled bet.
    if (currentAction.includes("collected") || currentAction.includes("Uncalled bet")) {
      hand.players[playerIndex].profitLoss += amount;
    } else {
      // PROBLEM - Currently doesn't account for amount player already has in pot. E.g, if I have 30p in pot and Andy raises to 50p, when I call, the ledger reads
      // "Chris called 0.50". Need to find a way to track amount already in pot and only add the difference :/
      // SOLUTION - When currentAction includes "Flop", "Turn", or "River", start a new Round.
      // Round object will be similar to Hand in that it contains an array of all players. We will borrow the profitLoss field to track the amount the player has in the pot
      // in the current round. Then whenever they call/raise, we subtract the amount already existing in the pot from their profit loss.
      let amountRequiredToMatchPot = amount - round.players[playerIndex].profitLoss;
      hand.players[playerIndex].profitLoss -= amountRequiredToMatchPot;
      round.players[playerIndex].profitLoss += amountRequiredToMatchPot;
    }
  }

  private extractAmountFromAction(currentAction: string): number | null {
    const floatPattern = /\b\d+\.\d+\b/g;

    const match = floatPattern.exec(currentAction);

    return match ? parseFloat(match[0]) : null;
  }

  private generatePlayersFromGameContext(): Player[] {
    return this._gameContext.players.map(player => {
      return {
        name: player.name,
        id: player.id,
        profitLoss: 0
      };
    })
  }

  private generateRound(): Round {
    return {
      players: this.generatePlayersFromGameContext()
    };
  }
}
