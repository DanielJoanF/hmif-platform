import { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { getForumMessages, postForumMessage } from '../services/forumService';
import styles from './ChatWidget.module.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('bot'); // 'bot' or 'forum'
  
  // Bot State
  const [botMessages, setBotMessages] = useState([
    { id: 1, sender: 'bot', text: 'Halo! Aku asisten HMIF. Ada yang bisa kubantu hari ini? 😊' }
  ]);
  const [botInput, setBotInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forum State
  const [forumMessages, setForumMessages] = useState([]);
  const [forumInput, setForumInput] = useState('');
  const [username, setUsername] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setForumMessages(getForumMessages());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, forumMessages]);

  const handleSendBotMessage = async () => {
    if (!botInput.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: botInput };
    setBotMessages(prev => [...prev, userMessage]);
    setBotInput('');
    setIsLoading(true);

    const history = botMessages.filter(m => m.sender !== 'bot' || m.id !== 1);
    const response = await sendMessageToGemini(history, botInput);
    
    setBotMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: response }]);
    setIsLoading(false);
  };

  const handleSendForumMessage = () => {
    if (!forumInput.trim()) return;
    const newMsg = postForumMessage(username, forumInput);
    setForumMessages(prev => [...prev, newMsg]);
    setForumInput('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={styles.fab} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className={`${styles.panel} glass-panel`}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'bot' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('bot')}
            >
              🤖 AI Asisten
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'forum' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('forum')}
            >
              💬 Forum
            </button>
          </div>

          {/* Bot Tab Content */}
          {activeTab === 'bot' && (
            <div className={styles.content}>
              <div className={styles.messages}>
                {botMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`${styles.message} ${msg.sender === 'user' ? styles.userMsg : styles.botMsg}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isLoading && <div className={`${styles.message} ${styles.botMsg}`}>Thinking...</div>}
                <div ref={messagesEndRef} />
              </div>
              <div className={styles.inputArea}>
                <input 
                  type="text"
                  value={botInput}
                  onChange={(e) => setBotInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendBotMessage()}
                  placeholder="Tanya sesuatu..."
                  className={styles.input}
                />
                <button onClick={handleSendBotMessage} className={styles.sendBtn}>↑</button>
              </div>
            </div>
          )}

          {/* Forum Tab Content */}
          {activeTab === 'forum' && (
            <div className={styles.content}>
              <div className={styles.messages}>
                {forumMessages.length === 0 && (
                  <p className={styles.emptyForum}>Belum ada pesan. Mulai diskusi!</p>
                )}
                {forumMessages.map(msg => (
                  <div key={msg.id} className={styles.forumMsg}>
                    <span className={styles.forumUser}>{msg.username}</span>
                    <p>{msg.text}</p>
                    <span className={styles.forumTime}>
                      {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className={styles.inputArea}>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nama..."
                  className={`${styles.input} ${styles.usernameInput}`}
                />
                <input 
                  type="text"
                  value={forumInput}
                  onChange={(e) => setForumInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendForumMessage()}
                  placeholder="Tulis pesan..."
                  className={styles.input}
                />
                <button onClick={handleSendForumMessage} className={styles.sendBtn}>↑</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
