// import './Loading.scss';
import * as React from 'react';
// import {Ins} from '../../index';

export default class Customer extends React.Component<
  {hideCustomer: (hide: boolean) => void},
  {},
  any
> {
  state = {
    isShowAnswer: 0
  };
  render() {
    const i18n = RG.jssdk.config.i18n;
    const {isShowAnswer} = this.state;
    const questionList = [
      // i18n.ui_customer_question_about_pwd
      {
        question: i18n.ui_customer_question_about_pwd,
        answer: i18n.ui_customer_answer_about_pwd
      },
      {
        question: i18n.ui_customer_question_about_account,
        answer: i18n.ui_customer_answer_about_account
      },
      {
        question: i18n.ui_customer_question_about_update,
        answer: i18n.ui_customer_answer_about_update
      },
      {
        question: i18n.ui_customer_question_about_modify_pwd,
        answer: i18n.ui_customer_answer_about_modify_pwd
      },
      {
        question: i18n.ui_customer_question_about_change_acc,
        answer: i18n.ui_customer_answer_about_change_accd
      },
      {
        question: i18n.ui_customer_question_about_bind_email,
        answer: i18n.ui_customer_answer_about_bind_email
      },
      {
        question: i18n.ui_customer_question_payment,
        answer: i18n.ui_customer_answer_payment
      }
    ];
    return (
      <div className='rg-login-main rg-customer rg-center-a'>
        <div className='rg-login-header'>
          {i18n.txt_customer_service}
         {/*  Ins.toggleCustomer(false) */}
          <span className='rg-icon-close' onClick={() => {}}></span>
        </div>
        <div className='rg-customer-content'>
          <p className='rg-customer-tip'>{i18n.txt_common_problem_hint}</p>
          <div className='rg-customer-list-wrap'>
            <ul className='rg-customer-list'>
              {questionList.map((item, index) => {
                return (
                  <li className='rg-customer-question-wrap' key={'rg-answer' + index}>
                    <p
                      className='rg-customer-question'
                      onClick={() => {
                        this.setState({isShowAnswer: index});
                      }}
                    >
                      {item.question}
                      <span className='rg-customer-down-icon'></span>
                    </p>
                    {isShowAnswer === index ? (
                      <div
                        className='rg-customer-answer'
                        dangerouslySetInnerHTML={{__html: item.answer}}
                      ></div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
