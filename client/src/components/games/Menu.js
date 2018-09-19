import * as React from 'react'

export default class Menu extends React.Component {
    render() {
        return (
            <div>
                {this.props.showMenu && 
                <div>
                <button>Fire</button>
                <button>Wait</button>
                </div>}
            </div>
        )
    }
}