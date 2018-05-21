import React from 'react'
import { Sidebar, Menu} from 'semantic-ui-react'

export default class LeftToRightSidebar extends React.Component {
    
    render() {
    const visible = this.props.visible
        return (
            <div>
                <Sidebar as={Menu} animation='overlay' width='thin' visible={visible} icon='labeled' vertical inverted className="rooms-sidebar">
                    {this.props.children}
                </Sidebar>
            </div>
        )
    }
}
