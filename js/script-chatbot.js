class DataLibraryChatbot {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.apiKey = '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';
    this.conversationHistory = [];
    this.systemPrompt = `You are a helpful assistant for DataLibrary, a gaming website. Keep responses short and casual. 

DataLibrary info:
- Games: Pokemon (checklist), Roblox (game info), Valorant (agent/weapon stats), Minecraft (player lookup, skins, servers), World of Tanks (tank specs), Super Animal Royale (weapon stats), Fortnite (rarity guides)
- Team: Cooper (founder, full stack), Lxzy (full stack), Bravo (full stack), Ampired (frontend), CPU (C++/frontend), Pepper (frontend), Sugar (frontend/API)
- Discord bot invite: https://discord.com/oauth2/authorize?client_id=1339214670099382382&permissions=8&integration_type=0&scope=bot
- Discord server: https://discord.gg/t5BGDzzSXg
- Bot commands: -testwelcome, -ticketcreate, -reactionrole, -rules
- Founded: 7-6-2025, first website: 11-6-2025, team formed: 16-6-2025

Be helpful but not overly enthusiastic. Answer questions directly.`;

    this.fallbackResponses = {
      greetings: ["Hey! What's up?", "Hi there! How can I help?", "Hello! What do you need?"],
      general: ["Ask me about our games, team, or Discord bot.", "I can help with DataLibrary questions.", "What would you like to know?"],
      error: ["Sorry, having trouble right now. Try asking about our games or team.", "Can't connect at the moment. Ask me about DataLibrary stuff."]
    };
    this.init();
  }

  init() {
    this.createInterface();
    this.attachHandlers();
  }

  createInterface() {
    const widget = document.createElement('div');
    widget.innerHTML = `
      <div id="dl-chatbot-widget" class="dl-chat-widget">
        <div id="dl-chat-button" class="dl-chat-button">
          <i class="fas fa-comments"></i>
        </div>
        <div id="dl-chat-window" class="dl-chat-window dl-chat-hidden">
          <div class="dl-chat-header">
            <div class="dl-chat-header-content">
              <i class="fas fa-user-circle"></i>
              <span>DataLibrary Help</span>
            </div>
            <button id="dl-chat-close" class="dl-chat-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div id="dl-chat-messages" class="dl-chat-messages">
            <div class="dl-chat-message dl-bot-message">
              <div class="dl-message-content">
                Hi! Ask me about our games, team, or Discord bot.
              </div>
            </div>
          </div>
          <div class="dl-chat-input-container">
            <input type="text" id="dl-chat-input" placeholder="Type your message..." maxlength="500">
            <button id="dl-chat-send">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(widget);
  }

  attachHandlers() {
    const button = document.getElementById('dl-chat-button');
    const closeBtn = document.getElementById('dl-chat-close');
    const input = document.getElementById('dl-chat-input');
    const sendBtn = document.getElementById('dl-chat-send');

    button.onclick = () => this.toggleWindow();
    closeBtn.onclick = () => this.toggleWindow();

    input.onkeypress = (e) => {
      if (e.key === 'Enter' && !this.isTyping) this.handleMessage();
    };

    sendBtn.onclick = () => {
      if (!this.isTyping) this.handleMessage();
    };
  }

  toggleWindow() {
    const window = document.getElementById('dl-chat-window');
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      window.classList.remove('dl-chat-hidden');
      setTimeout(() => {
        document.getElementById('dl-chat-input').focus();
      }, 150);
    } else {
      window.classList.add('dl-chat-hidden');
    }
  }

  async handleMessage() {
    const input = document.getElementById('dl-chat-input');
    const text = input.value.trim();
    
    if (!text || this.isTyping) return;

    this.displayMessage(text, 'user');
    this.conversationHistory.push({role: 'user', content: text});
    input.value = '';
    
    this.showTypingIndicator();
    
    const response = await this.getAIResponse(text);
    
    this.hideTypingIndicator();
    this.displayMessage(response, 'bot');
    this.conversationHistory.push({role: 'assistant', content: response});

    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-8);
    }
  }

  async getAIResponse(userMessage) {
    if (this.apiKey === 'YOUR_HUGGING_FACE_API_KEY_HERE') {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const messages = [
        {role: 'system', content: this.systemPrompt},
        ...this.conversationHistory.slice(-6),
        {role: 'user', content: userMessage}
      ];

      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: this.conversationHistory.filter(m => m.role === 'user').slice(-3).map(m => m.content),
            generated_responses: this.conversationHistory.filter(m => m.role === 'assistant').slice(-3).map(m => m.content),
            text: userMessage
          },
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      if (data.generated_text) {
        return this.filterResponse(data.generated_text);
      } else {
        return this.getFallbackResponse(userMessage);
      }
    } catch (error) {
      console.error('AI API error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  filterResponse(response) {
    const filtered = response.replace(this.conversationHistory.map(m => m.content).join(' '), '').trim();
    
    if (filtered.length < 5) {
      return "I can help with questions about DataLibrary games, team, or Discord bot.";
    }
    
    if (filtered.length > 200) {
      return filtered.substring(0, 200) + "...";
    }
    
    return filtered;
  }

  getFallbackResponse(userMessage) {
    const input = userMessage.toLowerCase().trim();

    if (this.matchesPattern(input, ['hi', 'hello', 'hey', 'sup', 'yo', 'what\'s up', 'whats up', 'helo'])) {
      return this.randomChoice(this.fallbackResponses.greetings);
    }

    if (this.matchesPattern(input, ['are you real', 'you real', 'are you human', 'real person', 'bot', 'ai'])) {
      return "Just a bot, but I can help you find stuff!";
    }

    if (this.hasKeywords(input, ['pokemon', 'pokémon', 'poke'])) {
      return "We have a Pokemon checklist where you can track your collection and see all the data.";
    }

    if (this.hasKeywords(input, ['roblox', 'robux'])) {
      return "Our Roblox section has info about different games.";
    }

    if (this.hasKeywords(input, ['valorant', 'agent', 'weapon'])) {
      return "Valorant section has agent stats and weapon info.";
    }

    if (this.hasKeywords(input, ['minecraft', 'server', 'skin'])) {
      return "Minecraft area has player lookups, skins, and server lists.";
    }

    if (this.hasKeywords(input, ['tank', 'world of tanks', 'wot'])) {
      return "World of Tanks section covers tank specs and maps.";
    }

    if (this.hasKeywords(input, ['animal', 'super animal', 'royale'])) {
      return "Super Animal Royale section has weapon stats and character info.";
    }

    if (this.hasKeywords(input, ['fortnite', 'battle royale'])) {
      return "Fortnite section has rarity guides and history.";
    }

    if (this.hasKeywords(input, ['cooper'])) {
      return "Cooper founded DataLibrary and does full stack development.";
    }

    if (this.hasKeywords(input, ['lxzy'])) {
      return "Lxzy is a full stack developer.";
    }

    if (this.hasKeywords(input, ['bravo'])) {
      return "Bravo is a full stack developer.";
    }

    if (this.hasKeywords(input, ['ampired'])) {
      return "Ampired does frontend development.";
    }

    if (this.hasKeywords(input, ['cpu'])) {
      return "CPU works with C++ and frontend.";
    }

    if (this.hasKeywords(input, ['pepper'])) {
      return "Pepper does frontend development.";
    }

    if (this.hasKeywords(input, ['sugar'])) {
      return "Sugar does frontend and API work.";
    }

    if (this.hasKeywords(input, ['team', 'developer', 'staff', 'who made', 'who built'])) {
      return "Cooper (founder), Lxzy, Bravo (full stack), Ampired, CPU, Pepper, Sugar (frontend), plus editors and moderators.";
    }

    if (this.hasKeywords(input, ['bot', 'discord bot', 'invite'])) {
      if (this.hasKeywords(input, ['invite', 'add'])) {
        return "Add our Discord bot: https://discord.com/oauth2/authorize?client_id=1339214670099382382&permissions=8&integration_type=0&scope=bot";
      }
      if (this.hasKeywords(input, ['command', 'setup', 'how to'])) {
        return "Setup: Put bot role above Member, create Manager role, add Announcements/Member roles, make ┆👋┆welcome channel.";
      }
      return "Commands: -testwelcome, -ticketcreate, -reactionrole, -rules";
    }

    if (this.hasKeywords(input, ['discord', 'server', 'join', 'community'])) {
      return "Join us: https://discord.gg/t5BGDzzSXg";
    }

    if (this.hasKeywords(input, ['about', 'what is', 'datalibrary', 'what does'])) {
      return "DataLibrary provides gaming tools and resources built by our team.";
    }

    if (this.hasKeywords(input, ['contact', 'help', 'support', 'reach'])) {
      return "Reach us through Discord.";
    }

    if (this.hasKeywords(input, ['timeline', 'history', 'when', 'started'])) {
      return "Started 7-6-2025, first website 11-6-2025, team formed 16-6-2025.";
    }

    if (this.hasKeywords(input, ['game', 'games', 'website', 'what games', 'type', 'what type'])) {
      return "We have Pokemon, Roblox, Valorant, Minecraft, World of Tanks, Super Animal Royale, and Fortnite. Which one?";
    }

    if (this.hasKeywords(input, ['thanks', 'thank you', 'appreciate', 'thx'])) {
      return this.randomChoice(["No problem!", "You're welcome!", "Happy to help!"]);
    }

    if (this.hasKeywords(input, ['cool', 'awesome', 'nice', 'great', 'amazing'])) {
      return "Thanks! Anything else you need?";
    }

    return this.randomChoice(["Ask me about our games, team, or Discord bot.", "I can help with DataLibrary questions.", "What would you like to know?"]);
  }

  showTypingIndicator() {
    this.isTyping = true;
    const container = document.getElementById('dl-chat-messages');
    const typing = document.createElement('div');
    typing.className = 'dl-chat-message dl-bot-message';
    typing.id = 'typing-indicator';
    typing.innerHTML = `
      <div class="dl-typing-indicator">
        <div class="dl-typing-dots">
          <div class="dl-typing-dot"></div>
          <div class="dl-typing-dot"></div>
          <div class="dl-typing-dot"></div>
        </div>
      </div>
    `;
    
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  displayMessage(content, sender) {
    const container = document.getElementById('dl-chat-messages');
    const message = document.createElement('div');
    message.className = `dl-chat-message dl-${sender}-message`;
    message.innerHTML = `<div class="dl-message-content">${content}</div>`;
    
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
  }

  matchesPattern(text, patterns) {
    return patterns.some(pattern => text.includes(pattern));
  }

  hasKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DataLibraryChatbot();
});