import * as React from 'react'
import * as ReactDOM from 'react-dom'


interface HelloProps {
    name: string
}

export default class HelloMessage extends React.Component<HelloProps, any> {
    constructor(props: HelloProps) {
        super(props)
    }
    render() {
        return <div>{this.props.name}</div>
    }
}