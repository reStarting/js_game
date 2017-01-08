import * as React from 'react'
import {render} from 'react-dom'
import HelloMessage from './Hello'
import Board from './Board';

render(
    <HelloMessage name="Hello" />, 
    document.getElementById('container')
)
new Board(30, 20);