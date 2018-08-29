import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Form, Input, DatePicker, Button } from 'antd';
import '../App.css';

const FormItem = Form.Item;

class TimeRelatedForm extends Component {
    constructor() {
        super();
        this.state = {
          formLayout: 'vertical',
        };
    }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const values = {
        // ...fieldsValue,
        'firstName': fieldsValue['firstName'],
        'lastName': fieldsValue['lastName'],
        'email': fieldsValue['email']
      }; 
      console.log('Received values of form: ', values);
      axios.post('/api/v1/appointments', values)
      .then((success) => {
        console.log('success')
    })
    .catch((err, response) => {
        console.log(err)
        response.status(500).json({
            msg: 'Something wrong',
        });
    });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    return (
      <Form className="formGroup" onSubmit={this.handleSubmit}>
        {/* <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('datePicker', config)(
            <DatePicker 
            style={{ width: '100%' }}
            disabledDate={this.disabledDate}
            onChange={this.handleDateSelection}
            />
          )}
        </FormItem> */}
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please input your first name', whitespace: true }],
          })(
            <Input placeholder="First Name"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('lastName', {
            rules: [{ required: true, message: 'Please input your last name', whitespace: true }],
          })(
            <Input placeholder="Last Name"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input placeholder="youremail@gmail.com"/>
          )}
        </FormItem>
        <FormItem>
          <Button className="primary" type="primary" htmlType="submit">Book Appointment</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedTimeRelatedForm = Form.create()(TimeRelatedForm);

export default WrappedTimeRelatedForm;