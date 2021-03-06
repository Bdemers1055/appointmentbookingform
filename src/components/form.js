import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Form, Input, DatePicker, Button, Alert } from 'antd';
import '../App.css';

const FormItem = Form.Item;

class TimeRelatedForm extends Component {
    constructor() {
        super();
        this.state = {
          appearance: 'none',
          display: 'none',
          formLayout: 'vertical',
          selectedDate: null
        };
    }
    componentDidMount(){
      this.fetchAvailableDates();
      this.fetchNextMonthsAvailableDates();
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
  fetchNextMonthsAvailableDates(){
    const month = moment().format('2018-09');
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
    fetchAvailableTimes(date){
      const day = date.format('YYYY-MM-DDT17:00:00');
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
      return current && !this.state.dates.some(obj => current.isSame(obj.date,'day'));
    }
    disabledHours = (current) => { // this is to enable the avail. times (do not disable)
      console.log(current);
      return current && !this.state.time.some(obj => current.isSame(obj.time,'hour'));
    }
    handleDateSelection = (date, dateString) => {
      this.setState({
        selectedDate : date
      })
      this.fetchAvailableTimes(date)
    }
    handleTimeSelection = (time, timeString) => {
      this.setState({
        selectedTime : '19:00:00-0400'
      })
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
        'datePicker': fieldsValue['datePicker'].format('YYYY-MM-DDTHH:mm:ss'),
        'firstName': fieldsValue['firstName'],
        'lastName': fieldsValue['lastName'],
        'email': fieldsValue['email']
      };
      console.log('Received values of form: ', values);
      axios.post('/api/v1/appointments', values)
      .then((success) => {
        console.log('success')
        this.displaySuccessMessage();
    })
    .catch((err, response) => {
        console.log(err)
        this.displayErrorMessage();
        // response.status(500).json({
        //     msg: 'Something wrong',
        // });
    });
    });
  }
  displaySuccessMessage(){
    this.setState({
      display: 'none',
      appearance: 'block'
    });
}
displayErrorMessage(){
  this.setState({
    appearance: 'none',
    display: 'block'
  });
}
  render() {
    const successStyles = { display: this.state.appearance };
    const errorStyles = { display: this.state.display };
    const defaultValue = moment('YYYY-MM-DDT17:00:00');
    const format = 'HH:00';
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
        <FormItem
          {...formItemLayout}
          // label="DatePicker"
        >
          {getFieldDecorator('datePicker', config)(
            <DatePicker
            style={{ width: '100%' }}
              showTime={{ defaultValue: moment('17:00:00', 'HH:mm:ss') }}
              placeholder="Select Date and Time"
              disabledDate={this.disabledDate}
              onChange={this.handleDateSelection}
              format="YYYY-MM-DDTHH:mm:ss"
              use12Hours
              />
          )}
        </FormItem>
    
        <FormItem
          {...formItemLayout}
          // label={(
          //   <span>
          //     First Name&nbsp;
          //   </span>
          // )}
        >
          {getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please input your first name', whitespace: true }],
          })(
            <Input placeholder="First Name"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          // label={(
          //   <span>
          //     Last Name&nbsp;
          //   </span>
          // )}
        >
          {getFieldDecorator('lastName', {
            rules: [{ required: true, message: 'Please input your last name', whitespace: true }],
          })(
            <Input placeholder="Last Name"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          // label="E-mail"
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
        <Alert style = { successStyles } message="Success! your appointment is scheduled for Fri. Sept. 9th at 9:00 am." type="success" />
        <Alert style = { errorStyles } message="Unfortunately, the time you selected is not avaible. Please select another time." type="error" />
      </Form>
    );
  }
}

const WrappedTimeRelatedForm = Form.create()(TimeRelatedForm);

export default WrappedTimeRelatedForm;