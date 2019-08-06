import React from "react";
import '../styles/Home.css';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

const axios = require('axios');
const override = css`
    display: block;
    margin: 0 auto;
    margin-top: 65px;
    border-color: #fa8900;
`;

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
            url: 'https://api.jotform.com/user/forms',
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
                    <BounceLoader
                        css={override}
                        sizeUnit={"px"}
                        size={100}
                        color={'#fa8900'}
                        loading={this.state.isLoading}
                    />
                </div>
            )
        }

        return (
            <div className="Home">


                <Container>
                    <Row>
                        {forms.length === 0 ?
                            <Col><p>You have no form.</p></Col>
                            :
                            this.state.forms.map(form => (
                                form.status !== 'DELETED' ?
                                    <Col style={{ paddingBottom: 30 }}>
                                        <Card style={{ width: '18rem', marginLeft: 20 }}>
                                            <Card.Img variant="top" style={{
                                                marginLeft: 'auto',
                                                marginRight: 'auto',
                                                width: '250px'
                                            }} src="https://www.jotform.com/resources/assets/icon/jotform-logomark-transparent-400x400.png" />
                                            <Card.Body>
                                                <Card.Title><a className="link" href={"https://form.jotform.com/" + form.id}>{form.title}</a></Card.Title>
                                                <Card.Text>{form.count === 0 ? 'No submission has made.' : form.count + ' submissions made.'}</Card.Text>
                                                <Button bsPrefix="custom-btn" onClick={() => this.props.history.push(`/form/${form.id}`, { form: form })} >View</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    : null
                            ))
                        }
                    </Row>
                </Container>

            </div>
        )
    }
}