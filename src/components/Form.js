import React from "react";
import '../styles/Form.css';
import { Table, Button, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import SweetAlert from "react-bootstrap-sweetalert";
const axios = require('axios');

export default class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            nofrows: 0,
            fields: [],
            others: [],
            flag: "",
            wait: false,
            configuring: false
        }
        this.getFormQuestions()
    }

    getFormQuestions() {
        axios({
            method: 'get',
            url: 'https://api.jotform.com/form/' + this.state.id + '/questions',
            headers: {
                'Accept': 'application/json'
            },
            params: {
                apiKey: "6582cf035c783b2d5cdfccd0b5ecc840"
            }
        })
            .then(this.handleFields)
            .catch(this.handleError)
    }

    handleError = (error) => {
        console.log(error.response)
    }

    handleFields = (questions) => {
        const question = questions.data.content

        this.setState(state => {
            const fields = [];
            return { fields }
        })

        let value = null

        for (const id in question) {

            switch (question[id].type) {
                case 'control_fullname':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_fullname*${question[id].qid}`,
                        "type": "Full Name",
                        "value": ""
                    }
                    break;
                case 'control_email':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_email*${question[id].qid}`,
                        "type": "Email Address",
                        "value": ""
                    }
                    break;
                case 'control_address':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_address*${question[id].qid}`,
                        "type": "Street Address",
                        "value": ""
                    }
                    break;
                case 'control_phone':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_phone*${question[id].qid}`,
                        "type": "Phone",
                        "format": "### ### ####",
                        "value": ""
                    }
                    break;
                case 'control_datetime':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_datetime*${question[id].qid}`,
                        "type": "Date",
                        "format": "%m-%d-%Y",
                        "value": ""
                    }
                    break;
                case 'control_time':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_time*${question[id].qid}`,
                        "type": "Date",
                        "format": "%H-%M-%p",
                        "value": ""
                    }
                    break;
                case 'control_textbox':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_textbox*${question[id].qid}`,
                        "type": "Words",
                        "min": 1,
                        "max": 5,
                        "value": ""
                    }
                    break;
                case 'control_textarea':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_textarea*${question[id].qid}`,
                        "type": "Words",
                        "min": 5,
                        "max": 20,
                        "value": ""
                    }
                    break;
                case 'control_dropdown':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_dropdown*${question[id].qid}`,
                        "type": "Title",
                        "value": ""
                    }
                    this.setState(state => {
                        const others = this.state.others.concat(question[id].options)
                        return { others }
                    })
                    break;
                case 'control_radio':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_radio*${question[id].qid}`,
                        "type": "Title",
                        "value": ""
                    }
                    this.setState(state => {
                        const others = this.state.others.concat(question[id].options)
                        return { others }
                    })
                    break;
                case 'control_checkbox':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_checkbox*${question[id].qid}`,
                        "type": "Title",
                        "value": ""
                    }
                    this.setState(state => {
                        const others = this.state.others.concat(question[id].options)
                        return { others }
                    })
                    break;
                case 'control_number':
                    value = {
                        "qid": question[id].qid,
                        "name": `control_number*${question[id].qid}`,
                        "type": "Number",
                        "min": 1,
                        "max": 99999,
                        "decimals": 2,
                        "value": ""
                    }
                    break;
                default: break;
            }

            if (value !== null) {
                this.setState(state => {
                    const fields = state.fields.concat(value);
                    return { fields }
                })
                value = null
            }
        }
    }

    getRandomRecords = () => {
        axios({
            method: 'post',
            url: 'https://www.mockaroo.com/api/generate.json',
            headers: {
                'Accept': 'application/json'
            },
            params: {
                key: "5c75c230",
                count: 1,
                fields: JSON.stringify(this.state.fields)
            }
        })
            .then(this.handleRecords)
            .catch(this.handleError)
    }

    postFormSubmission() {
        var parsedData = {}
        const x = this.state.fields

        for (let i = 0; i < x.length; i++) {
            if (x[i].name === `control_fullname*${x[i].qid}`) {
                var first = { [`submission[${x[i].qid}][first]`]: x[i].value.split(" ")[0] }
                var last = { [`submission[${x[i].qid}][last]`]: x[i].value.split(" ")[1] }
                parsedData = { ...parsedData, ...first, ...last }
            } else if (x[i].name === `control_address*${x[i].qid}`) {
                var addr_line1 = { [`submission[${x[i].qid}][addr_line1]`]: x[i].value.split(" ")[1] }
                var addr_line2 = { [`submission[${x[i].qid}][addr_line2]`]: x[i].value.split(" ")[2] }
                var postal = { [`submission[${x[i].qid}][postal]`]: x[i].value.split(" ")[0] }
                parsedData = { ...parsedData, ...addr_line1, ...addr_line2, ...postal }
            } else if (x[i].name === `control_phone*${x[i].qid}`) {
                var area = { [`submission[${x[i].qid}][area]`]: x[i].value.split(" ")[0] }
                var phone = { [`submission[${x[i].qid}][phone]`]: x[i].value.split(" ")[1] + x[i].value.split(" ")[2] }
                parsedData = { ...parsedData, ...area, ...phone }
            } else if (x[i].name === `control_datetime*${x[i].qid}`) {
                var month = { [`submission[${x[i].qid}][month]`]: x[i].value.split("-")[0] }
                var day = { [`submission[${x[i].qid}][day]`]: x[i].value.split("-")[1] }
                var year = { [`submission[${x[i].qid}][year]`]: x[i].value.split("-")[2] }
                parsedData = { ...parsedData, ...month, ...day, ...year }
            } else if (x[i].name === `control_time*${x[i].qid}`) {
                var hourSelect = { [`submission[${x[i].qid}][hourSelect]`]: x[i].value.split("-")[0] }
                var minuteSelect = { [`submission[${x[i].qid}][minuteSelect]`]: x[i].value.split("-")[1] }
                var ampm = { [`submission[${x[i].qid}][ampm]`]: x[i].value.split("-")[2] }
                parsedData = { ...parsedData, ...hourSelect, ...minuteSelect, ...ampm }
            } else {
                var other = { [`submission[${x[i].qid}]`]: x[i].value }
                parsedData = { ...parsedData, ...other }
            }
        }

        axios({
            method: 'post',
            url: 'https://api.jotform.com/form/' + this.state.id + '/submissions',
            headers: {
                'Accept': 'application/json'
            },
            params: {
                apiKey: "6582cf035c783b2d5cdfccd0b5ecc840",
                ...parsedData
            }
        })
            .then(this.handleSubmission)
            .catch(this.handleError)
    }

    handleSubmission = () => {
    }

    handleRecords = (records) => {

        for (const key in records.data) {
            const fields = this.state.fields
            var choices = []
            var foundIndex = this.state.fields.findIndex(x => x.name == key);

            if (fields[foundIndex].name === `control_dropdown*${fields[foundIndex].qid}`) {
                choices = this.state.others[0].split('|')
                this.setState(state => {
                    const fields = state.fields;
                    fields[foundIndex].value = choices[Math.floor(Math.random() * choices.length)]
                    return { fields }
                })
            } else if (fields[foundIndex].name === `control_radio*${fields[foundIndex].qid}`) {
                choices = this.state.others[1].split('|')
                this.setState(state => {
                    const fields = state.fields;
                    fields[foundIndex].value = choices[Math.floor(Math.random() * choices.length)]
                    return { fields }
                })
            } else if (fields[foundIndex].name === `control_checkbox*${fields[foundIndex].qid}`) {
                choices = this.state.others[2].split('|')
                this.setState(state => {
                    const fields = state.fields;
                    fields[foundIndex].value = choices[Math.floor(Math.random() * choices.length)]
                    return { fields }
                })
            } else {
                this.setState(state => {
                    const fields = state.fields;
                    fields[foundIndex].value = records.data[key]
                    return { fields }
                })
            }
        }

        if (this.state.flag === "send") {
            this.postFormSubmission()
            this.setState({ nofrows: this.state.nofrows - 1 })

            if (this.state.nofrows === 0) {
                this.setState({ flag: "" })
                this.setState({ wait: false })
            } else {
                this.getRandomRecords()
            }
        }
    }

    checkTextFormat = (e, qid) => {
        const text = e.target.value
        const regex = /^\d+,\d+$/
        const field = this.state.fields[this.state.fields.findIndex(x => x.qid == qid)]

        if (regex.test(text)) {
            field.min = text.split(",")[0]
            field.max = text.split(",")[1]
        }
    }

    checkNumberFormat = (e, qid) => {
        const text = e.target.value
        const regex = /^\d+,\d+,\d+$/
        const field = this.state.fields[this.state.fields.findIndex(x => x.qid == qid)]

        if (regex.test(text)) {
            field.min = text.split(",")[0]
            field.max = text.split(",")[1]
            field.decimals = text.split(",")[2]
        }
    }

    updateNOsubmission = (e) => {
        this.setState({ nofrows: e.target.value })
    }

    render() {
        const phoneOptions = ['###-###-####', '(###) ###-####', '### ### ####', '+# ### ### ####', '+# (###) ###-####', '+#-###-###-####', '#-(###)###-####', '##########']
        const dateOptions = ['%m-%d-%Y', '%d-%m-%Y', '%Y-%m-%d', '%Y-%d-%m']

        return (
            <div className="Form">

                <div style={{ paddingBottom: 15 }}>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Number of submission&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            value={this.state.nofrows === 0 ? "" : this.state.nofrows.toString()}
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            placeholder={this.state.nofrows}
                            onChange={(e) => this.updateNOsubmission(e)}
                        />
                    </InputGroup>
                </div>

                {this.state.configuring ?
                    <SweetAlert
                        title="Configuration"
                        style={{ height: 450 }}
                        onConfirm={() => this.setState({ configuring: false })}
                    >

                        {this.state.fields.map(field => (
                            (() => {
                                if (field.name === `control_phone*${field.qid}`) {
                                    return (
                                        <Dropdown style={{ marginTop: 20 }}>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                Click to select a custom phone format for qid {field.qid}</Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {phoneOptions.map(i => (
                                                    <Dropdown.Item onClick={() => this.setState(state => {
                                                        var test = state.fields[state.fields.findIndex(x => x.qid == field.qid)]
                                                        test.format = i
                                                        return { test }
                                                    })}>{i}</Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )
                                } else if (field.name === `control_datetime*${field.qid}`) {
                                    return (
                                        <Dropdown style={{ marginTop: 20 }}>
                                            <Dropdown.Toggle variant="info" id="dropdown-basic">
                                                Click to select a custom date format for qid: {field.qid}</Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {dateOptions.map(i => (
                                                    <Dropdown.Item onClick={() => this.setState(state => {
                                                        var test = state.fields[state.fields.findIndex(x => x.qid == field.qid)]
                                                        test.format = i
                                                        return { test }
                                                    })}>{i}</Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )
                                } else if (field.name === `control_textbox*${field.qid}`) {
                                    return (
                                        <InputGroup className="mb-4" style={{ width: 443, marginTop: 20 }}>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroup-sizing-sm">Enter word count for qid: {field.qid} textbox </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="format: min,max"
                                                onChange={(e) => this.checkTextFormat(e, field.qid)} />
                                        </InputGroup>
                                    )
                                } else if (field.name === `control_textarea*${field.qid}`) {
                                    return (
                                        <InputGroup className="mb-4" style={{ width: 443, marginTop: 15 }}>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroup-sizing-sm">Enter word count for qid: {field.qid} textarea</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="format: min,max"
                                                onChange={(e) => this.checkTextFormat(e, field.qid)} />
                                        </InputGroup>
                                    )
                                } else if (field.name === `control_number*${field.qid}`) {
                                    return (
                                        <InputGroup className="mb-4" style={{ width: 443, marginTop: 15 }}>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroup-sizing-sm">Enter the range for qid: {field.qid} number</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="format: min,max,decimal"
                                                onChange={(e) => this.checkNumberFormat(e, field.qid)} />
                                        </InputGroup>
                                    )
                                } else {
                                    return null
                                }
                            })()
                        ))}

                    </SweetAlert>
                    : null}

                <Table style={{ width: 400 }} striped bordered hover >
                    <thead>
                        <tr>
                            <th style={{ width: "35%" }}>Field Type</th>
                            <th style={{ width: "35%" }}>QID</th>
                            <th style={{ width: "65%" }}>Answer</th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.fields.map(field => (
                            <tr key={field.qid}>
                                <td>
                                    {(() => {
                                        if (field.name === `control_time*${field.qid}`) {
                                            return 'Time'
                                        } else if (field.name === `control_textbox*${field.qid}`) {
                                            return 'Text Box'
                                        } else if (field.name === `control_textarea*${field.qid}`) {
                                            return 'Text Area'
                                        } else if (field.name === `control_dropdown*${field.qid}`) {
                                            return 'Dropdown Menu'
                                        } else if (field.name === `control_radio*${field.qid}`) {
                                            return 'Radio Button'
                                        } else if (field.name === `control_checkbox*${field.qid}`) {
                                            return 'Check Box'
                                        } else {
                                            return field.type
                                        }
                                    })()}
                                </td>
                                <td>{field.qid}</td>
                                <td>{field.value === '' ? 'Empty' : field.value}</td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
                <div className="Buttons">
                    <Button bsPrefix="configure-btn" disabled={this.state.flag === "send" ? true : false} onClick={() => this.setState({ configuring: true })}>Configure Mock Data</Button>
                    <Button bsPrefix="fill-btn" disabled={this.state.flag === "send" ? true : false} onClick={this.getRandomRecords}>Fill Form</Button>
                    <Button bsPrefix="send-btn" disabled={this.state.nofrows === 0 || this.state.flag === "send" ? true : false} onClick={() => {
                        this.setState({ wait: true });
                        this.setState({ flag: "send" });
                        this.getRandomRecords();
                    }}>Send to Form</Button>
                </div>
            </div>
        )
    }
}