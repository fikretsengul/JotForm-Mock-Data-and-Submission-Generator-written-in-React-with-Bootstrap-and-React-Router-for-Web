import React from "react";
import '../styles/Home.css';
import { Card, Button } from 'react-bootstrap';
const axios = require('axios');

export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            forms: null
        }
        this.getForms()
    }

    getForms = () => {
        axios({
            method: 'get',
            url: 'http://api.jotform.com/user/forms',
            headers: {
                'Accept': 'application/json',
            },
            params: { apiKey: "6582cf035c783b2d5cdfccd0b5ecc840" }
        })
            .then(this.handleSuccess)
            .catch(this.handleError)
    }

    handleSuccess = (response) => {
        console.log(response)
        let content = response.data.content
        this.setState({ forms: content })
        this.setState({ isLoading: false })
    }

    handleError = (error) => {
        console.log(error.response.data)
    }

    render() {
        const { forms, isLoading } = this.state;

        if (isLoading) {
            return (
                <div className="Home">
                    <p>Loading</p>
                </div>
            )
        }

        return (
            <div className="Home">

                {forms.length === 0 ?
                    <p>You have no form.</p>
                    :
                    this.state.forms.map(form => (
                        form.status !== 'DELETED' ?
                            <Card style={{ width: '18rem', marginLeft: 20 }}>
                                <Card.Img variant="top" style={{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    width: '250px'
                                }} src="https://www.jotform.com/resources/assets/icon/jotform-logomark-transparent-400x400.png" />
                                <Card.Body>
                                    <Card.Title>{form.title}</Card.Title>
                                    <Card.Text>{form.count === 0 ? 'No submission has made.' : form.count + ' submissions made.'}</Card.Text>
                                    <Button bsPrefix="custom-btn" onClick={() => this.props.history.push(`/form/${form.id}`, { form: form })} >View</Button>
                                </Card.Body>
                            </Card>
                            : null
                    ))
                }

            </div>
        )
    }
}