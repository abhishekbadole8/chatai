import { useState } from "react";
import "./Main.css"
import axios from "axios";

function Main() {
    const [chats, setChats] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [loading, setLoading] = useState(false)

    const timestamp = new Date().toLocaleString();

    const fetchChat = async () => {
        try {
            const response = await axios.post(`https://chatai-aqub.onrender.com/api/chat`, {
                message: [
                    {
                        "role": "user",
                        "content": inputValue
                    }
                ]
            })
            if (response.data) {
                const data = response.data

                setChats(prevChats => [
                    ...prevChats,
                    { ...data, timestamp },

                ]);
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log(`error getting message`, error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue) {
            setChats(prevChats => [
                ...prevChats,
                {
                    role: "user",
                    content: inputValue,
                    timestamp
                }
            ]);
            setLoading(true)
            await fetchChat();
            setInputValue("")
        }
    }

    return (
        <div className="Main">
            <main>
                <ul id="chat-list">

                    {chats.length === 0 &&
                        <li className="assistant">
                            <p className="list-desc">Start Typing...</p>
                            <p className="list-dat">21 Aug | 08:00</p>
                            <span className="shape left" />
                        </li>}

                    {chats?.map((chat, index) => {
                        const { role, content, timestamp } = chat
                        console.log(chat);
                        return <li key={index} className={role}>
                            <p className="list-desc">{content}</p>
                            <p className="list-dat">{timestamp}</p>
                            <span className={role === "user" ? "shape right" : "shape left"} />
                        </li>
                    })}

                    {loading && (
                        <li className="assistant">
                            <p className="list-desc">Loading...</p>
                            <p className="list-dat">21 Aug | 08:00</p>
                            <span className="shape left" />
                        </li>)}

                </ul>
            </main>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter Input...." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <button type="submit" disabled={loading}>{loading ? 'Wait...' : 'Submit'}</button>
            </form>
        </div>
    )
}

export default Main;