import * as types from '../constants';

export function moveLeft() {
  return {type: types.MOVE_LEFT}
}

export function moveRight() {
  return {type: types.MOVE_RIGHT}
}

export function moveDown() {
  return {type: types.MOVE_DOWN}
}
export function transform() {
  return {type: types.TRANSFORM}
}
export function drop() {
  return {type: types.DROP}
}
