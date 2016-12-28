import {MOVE_LEFT, MOVE_RIGHT, MOVE_DOWN, TRANSFORM, DROP} from '../constants'
import * as Immutable from 'immutable'

let initialState = {
  board:[
    0x801, 0x801, 0x801, 0x801, 0x801,
    0x801, 0x801, 0x801, 0x801, 0x801, 
    0x801, 0x801, 0x801, 0x801, 0x801, 
    0x801, 0x801, 0x801, 0x801, 0x801,
    0xfff
  ],
  active: {}
}


export default function tetris(state: any = initialState, action: any) {
  switch(action.type) {
    case MOVE_LEFT:
    case MOVE_RIGHT:
    case MOVE_DOWN:
    case TRANSFORM:
    case DROP:
    default:
      return state
  }
}