import * as React from 'react'
import {render} from 'react-dom'
import Board from './Board';
import './index.css'

render(
    <Board width={30} height={20} />, 
    document.getElementById('container')
)