import React from "react";
import '../styles/Login.css';
import { Form, Button } from 'react-bootstrap';
import SweetAlert from "react-bootstrap-sweetalert";
const axios = require('axios');

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            error: ""
        }
    }

    updateUsername = (username) => {
        this.setState({ username: username })
    }

    updatePassword = (password) => {
        this.setState({ password: password })
    }

    handleLogin = () => {
        const { username, password } = this.state;

        if (username === "" || password === "") {
            this.setState({ error: "Username or password fields cannot be empty!" })
        } else {

            axios({
                method: 'post',
                url: 'https://api.jotform.com/login',
                headers: {
                    'Accept': 'application/json',
                },
                params: { username: username, password: password, appName: 'jot-api' }
            })
                .then(this.handleResponse)
        }
    }

    handleResponse = (response) => {
        const err = response.data.responseCode
        var result = ''

        if (err === 200) {
            this.props.history.push('/home')
        } else {
            switch (err) {
                case 401:
                    result = 'Your credentials are wrong. You are not authorized.'; break;
                case 402:
                    result = 'An unknown error has occured.'; break;
                case 403:
                    result = 'You have made so many login attempts. Please try again later.'; break;
                default: break;
            }

            this.setState({ error: result })
        }
    }

    render() {
        return (
            < div className="Login" >

                {this.state.error !== "" ?
                    <SweetAlert danger title="Sorry!" onConfirm={() => this.setState({ error: "" })}>
                        {this.state.error}
                    </SweetAlert>
                    : null}

                <div style={{ width: 400 }}>

                    <div style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        width: '250px',
                    }}>
                        <img style={{ width: 250, height: 250 }} alt="" src='https://www.jotform.com/resources/assets/icon/jotform-logomark-transparent-400x400.png' />
                    </div>
                    <div style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#434343',
                        paddingBottom: 30,
                    }}>
                        <h5>JotForm Mock Data Generator</h5>
                    </div>

                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control value={this.state.username} type="text" onChange={(e) => this.updateUsername(e.target.value)} placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={this.state.password} type="password" onChange={(e) => this.updatePassword(e.target.value)} placeholder="Password" />
                        </Form.Group>
                        <Button bsPrefix="custom-btn" onClick={this.handleLogin}>
                            Login
                        </Button>
                        <p style={{ fontSize: 12 }}><b>NOTE:</b> This project has not fully completed yet and will be updated in future. Some outdated JotForm and custom components may not be recognized. Also, if you use Chrome you need to disable Chrome CORS Policy to make mock data API call by installing <a href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf">Allow CORS Extension</a>.</p>
                    </Form>
                </div>

            </div >
        )
    }
}