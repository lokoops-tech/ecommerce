import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Faq.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How long does delivery take?",
      answer: (
        <div className="delivery-times">
          <div className="delivery-row">
            <span>Within Eldoret:</span>
            <span className="delivery-duration">Same day delivery</span>
          </div>
          <div className="delivery-row">
            <span>Within Uasin Gishu:</span>
            <span className="delivery-duration">1-2 business days</span>
          </div>
          <div className="delivery-row">
            <span>Other Counties:</span>
            <span className="delivery-duration">2-4 business days</span>
          </div>
        </div>
      )
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-PESA, bank transfers, and cash on delivery within Eldoret"
    },
    {
      question: "Do you offer warranty?",
      answer: "Yes, all our electronics come with manufacturer warranty and local support"
    },
    {
      question: "Can I track my order?",
      answer: "Yes, once your order is dispatched, you'll receive a tracking number via SMS or email to monitor your delivery status."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for unopened items in their original packaging. For defective items, returns are accepted within 14 days of delivery."
    }
  ];

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      
      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="faq-item"
          >
            <button
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleQuestion(index)}
            >
              <span>{faq.question}</span>
              <ChevronDown className={`chevron ${activeIndex === index ? 'rotate' : ''}`} />
            </button>
            
            <div
              className={`faq-answer ${activeIndex === index ? 'show' : ''}`}
            >
              <div className="faq-answer-content">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;