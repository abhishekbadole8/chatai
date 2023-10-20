import { useState } from "react";
import "./Main.css"
import axios from "axios";

function Main() {
    const [chats, setChats] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [loading, setLoading] = useState(false)

    function formatCustomDate(inputDate) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const month = monthNames[inputDate.getMonth()];
        const day = inputDate.getDate();
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const amOrPm = hours >= 12 ? 'pm' : 'am';
        const formattedDate = `${day} ${month} ${hours % 12 || 12}:${minutes} ${amOrPm}`;

        return formattedDate;
    }

    const currentDate = new Date();
    const formattedDate = formatCustomDate(currentDate);

    const fetchChat = async (chats) => {
        try {
            const response = await axios.post(`https://chatai-aqub.onrender.com/api/chat`, {
                message: chats.map(chat => ({ role: chat.role, content: chat.content }))
            })
            if (response.data) {
                const data = response.data

                setChats(prevChats => [
                    ...prevChats,
                    { ...data, dateandtime: formattedDate },

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
                    dateandtime: formattedDate
                }
            ]);
            setLoading(true)
            setInputValue("")
            await fetchChat([
                ...chats,
                {
                    role: "user",
                    content: inputValue
                }
            ]);
        }
    }
  
    return (
        <div className="Main">
            <main>
                <ul id="chat-list">

                    {chats.length === 0 &&
                        <li className="assistant">
                            <p className="list-desc">Start Typing...</p>
                            <p className="list-dat">{formattedDate}</p>
                            <span className="shape left" />
                        </li>}

                    {chats?.map((chat, index) => {
                        const { role, content, timestamp } = chat
                        return <li key={index} className={role}>
                            <p className="list-desc">{content}</p>
                            <p className="list-dat">{formattedDate}</p>
                            <span className={role === "user" ? "shape right" : "shape left"} />
                        </li>
                    })}

                    {loading && (
                        <li className="assistant">
                            <p className="list-desc">Loading...</p>
                            <p className="list-dat">{formattedDate}</p>
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