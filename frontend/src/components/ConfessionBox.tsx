import { useState } from "react";
import { submitConfession } from "../helpers/submitConfession";
import type { Confession } from "../types/Confession";

export default function ConfessionBox () {
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [isNSFW, setIsNSFW] = useState(false);

    const handleSubmit = () => {
        if (!text.trim()) return;

        const newConfession = {
            text,
            title,
            category,
            isNSFW
        } as Confession;

        submitConfession(newConfession);
        setText("");
        setTitle("");
        setCategory("");
        setIsNSFW(false);
    }

    return (
        <div className="confession-box">
            <div className="composer">
                <div className="input-box">
                    <textarea
                        id="input-box"
                        placeholder="Say something you never dared to say..."
                        value={text}
                        onChange={(e) => {
                            const el = e.target;
                            setText(el.value.slice(0, 500));

                            el.style.height = "auto";
                            el.style.height = el.scrollHeight + "px";
                        }}
                    />
                </div>
                <div className="options-container">
                    <div className="char-count">
                        {text.length} / 500
                    </div>
                </div>
                <div className="actions">
                    <div id="title">
                        <input type="text" id="title-input" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="options">
                        <div>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select category (optional)</option>
                                <option value="school">School</option>
                                <option value="work">Work</option>
                                <option value="family">Family</option>
                                <option value="relationships">Relationships</option>
                                <option value="fantasy">A fantasy</option>
                                <option value="guilt">A guilt</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="nsfw">
                            <input type="checkbox" id="nsfw" checked={isNSFW} onChange={(e) => setIsNSFW(e.target.checked)} />
                            <label htmlFor="nsfw">NSFW</label>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="cancel"
                            onClick={() => setText("")}>
                            Cancel
                        </button>
                        <button className={`submit ${text.trim() ? 'enabled' : 'disabled'}`} onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}