import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DealAssistant.css';
import { FaMicrophone } from 'react-icons/fa';
import axios from 'axios';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

const DealAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [dealState, setDealState] = useState(null);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bootConversation = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/deal-chat/', {
          message: 'start new deal',
          deal_state: null,
        });
        setMessages([{ sender: 'ai', text: res.data.ai_message }]);
        setDealState(res.data.deal_state);
      } catch (error) {
        setMessages([
          {
            sender: 'ai',
            text: "I'm having trouble contacting the assistant. Please try again in a moment.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    bootConversation();
  }, []);

  const callDealChat = useCallback(async (userInput) => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setLoading(true);

    try {
      const res = await axios.post('/deal-chat/', {
        message: trimmed,
        deal_state: dealState,
      });
      setDealState(res.data.deal_state);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.data.ai_message }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '❌ Sorry, something went wrong talking to the assistant.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [dealState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    callDealChat(input);
    setInput('');
  };

  const handleMicClick = () => {
    if (!recognition) return;
    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (!loading) {
        callDealChat(transcript);
      }
    };
  }, [callDealChat]);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="deal-assistant">
      <h4><FaMicrophone /> AI Deal Assistant</h4>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
        {loading && <div className="message ai">Thinking…</div>}
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
        {/* <button
          type="button"
          onClick={handleMicClick}
          className={listening ? "mic-btn listening" : "mic-btn"}
          title={listening ? "Listening..." : "Start voice input"}
        >
          <FaMicrophone />
        </button>  */}
      </form>
    </div>
  );
};

export default DealAssistant;
