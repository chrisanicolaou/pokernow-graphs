import { Player } from "./player.model";
import { Hand } from "./hand.model";

export interface GameContext {
  players: Player[],
  hands: Hand[]
}
