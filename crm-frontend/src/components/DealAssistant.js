import React, { useState } from 'react';
import './DealAssistant.css';
import { FaMicrophone } from 'react-icons/fa';
import axios from 'axios';
import { useEffect, useRef } from 'react';

const DealAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I can help you create a new deal. What's the deal name?" }
  ]);
  const [input, setInput] = useState('');
  const [deal, setDeal] = useState({});
  const [listening, setListening] = useState(false);

  const sendMessage = (text, sender = 'user') => {
    setMessages((prev) => [...prev, { sender, text }]);
    handleAIResponse(text);
  };

   const handleAIResponse = async (userInput) => {
     const trimmed = userInput.trim();

     if (!deal.title) {
       setDeal({ ...deal, title: trimmed });
       setMessages((prev) => [...prev, { sender: 'ai', text: "Great! Which company is this deal with?" }]);
     }
     else if (!deal.company) {
       try {
         // Convert company name to ID via backend
         const res = await axios.get(`/api/companies/?search=${trimmed}`);
         const company = res.data.find(c => c.name.toLowerCase() === trimmed.toLowerCase());

         if (company) {
           setDeal({ ...deal, company: company.id });
           setMessages((prev) => [...prev, { sender: 'ai', text: "What's the deal value (in dollars)?" }]);
         } else {
           setMessages((prev) => [...prev, { sender: 'ai', text: "❌ I couldn't find that company. Please try again." }]);
         }
       } catch (err) {
         setMessages((prev) => [...prev, { sender: 'ai', text: "❌ Error looking up company." }]);
       }
     }
     else if (!deal.amount) {
       const amount = parseFloat(trimmed.replace(/[^0-9.]/g, ''));
       setDeal({ ...deal, amount });
       setMessages((prev) => [...prev, { sender: 'ai', text: "What stage is the deal in? (e.g., proposal, qualified)" }]);
     }
     else if (!deal.stage) {
       setDeal({ ...deal, stage: trimmed });
       setMessages((prev) => [...prev, { sender: 'ai', text: "When is the expected close date? (YYYY-MM-DD)" }]);
     }
     else if (!deal.close_date) {
       setDeal({ ...deal, close_date: trimmed });
       setMessages((prev) => [...prev, { sender: 'ai', text: "Do you want to associate any contacts? Type comma-separated contact IDs (or leave blank)." }]);
      }
     else if (!deal.contacts) {
       const contactIds = trimmed
         ? trimmed.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
         : [];
       const fullDeal = { ...deal, contacts: contactIds };

       setMessages((prev) => [...prev, { sender: 'ai', text: "Creating your deal..." }]);

       try {
         await axios.post('/api/deals/', fullDeal);
         setMessages((prev) => [...prev, { sender: 'ai', text: "✅ Deal created successfully!" }]);
         setDeal({}); // Reset
       } catch (err) {
         setMessages((prev) => [...prev, { sender: 'ai', text: "❌ Failed to create deal." }]);
       }
     }
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const messagesEndRef = useRef(null);
  useEffect(() => {messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });}, [messages]);

  return (
    <div className="deal-assistant">
      <h4><FaMicrophone /> AI Deal Assistant</h4>
       <div className="chat-window">
         {messages.map((msg, idx) => (
           <div key={idx} className={`message ${msg.sender}`}>{msg.text}</div>
         ))}
         <div ref={messagesEndRef} />
       </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default DealAssistant;
