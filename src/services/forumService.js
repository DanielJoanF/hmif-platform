const STORAGE_KEY = 'hmif_forum_messages';

export const getForumMessages = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const postForumMessage = (username, text) => {
    const messages = getForumMessages();
    const newMessage = {
        id: Date.now(),
        username: username || 'Anonymous',
        text,
        timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, newMessage];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    return newMessage;
};

export const clearForum = () => {
    localStorage.removeItem(STORAGE_KEY);
};
