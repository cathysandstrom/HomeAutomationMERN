import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

class Pages extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    Home Controller
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/devices/view" className="nav-link">
                                View Device Information
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/devices/command" className="nav-link">
                                Send Device Commands
                            </Link>
                        </Item>
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Pages