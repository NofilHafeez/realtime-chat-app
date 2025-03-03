import { useEffect, useState } from "react"

const App = () => {
  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.senderId}: {msg.text}</p>
        ))}
      </div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App