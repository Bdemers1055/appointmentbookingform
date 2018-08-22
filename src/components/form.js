import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Form, Input, DatePicker, TimePicker, Button } from 'antd';
import '../App.css';

const FormItem = Form.Item;

class TimeRelatedForm extends Component {
    constructor() {
        super();
        this.state = {
          formLayout: 'vertical',
        };
    }
    componentDidMount(){
      this.fetchAvailableDates();
      this.fetchAvailableTimes();
    }
    fetchAvailableDates(){
      const month = moment().format('YYYY-MM');
      const url = `/api/v1/availability/${month}`;
      axios.get(url).then((response) => {
          this.setState({
              dates: response.data,
              success: true,
          });
      }).catch((error) => {
          this.setState({
              success: false,
              error,
          });
    });
  }
    fetchAvailableTimes(){
      const day = moment().format('YYYY-MM-DD');
      const url = `/api/v1/availability/times/${day}`;
      axios.get(url).then((response) => {
          this.setState({
              time: response.data,
              success: true,
          });
      }).catch((error) => {
          this.setState({
              success: false,
              error,
          });
    });
    }  
    disabledDate = (current) => { // this is to enable the avail. dates (do not disable)
      console.log(this);
      return current && !this.state.dates.some(obj => current.isSame(obj.date,'day'));
    }
    disabledTime = (current) => { // this is to enable the avail. dates (do not disable)
      console.log(this);
      return current && !this.state.time.some(obj => current.isSame(obj.time,'time'));
    }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const values = {
        ...fieldsValue,
        'datePicker': fieldsValue['datePicker'].format('YYYY-MM-DD'),
        'timePicker': fieldsValue['timePicker'].format('HH:mm:ss'),
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
        sm: { span: 16 },
      },
    };
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="DatePicker"
        >
          {getFieldDecorator('datePicker', config)(
            <DatePicker 
            disabledDate={this.disabledDate}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="TimePicker"
        >
          {getFieldDecorator('timePicker', config)(
            <TimePicker 
            use12Hours
            minuteStep={60} 
            secondStep={60}
            format="HH:mm:ss a" 
            disabledTime={this.disabledTime}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              First Name&nbsp;
            </span>
          )}
        >
          {getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please input your first name', whitespace: true }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              Last Name&nbsp;
            </span>
          )}
        >
          {getFieldDecorator('lastName', {
            rules: [{ required: true, message: 'Please input your last name', whitespace: true }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedTimeRelatedForm = Form.create()(TimeRelatedForm);

export default WrappedTimeRelatedForm;