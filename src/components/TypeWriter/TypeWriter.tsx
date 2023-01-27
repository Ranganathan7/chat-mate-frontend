import React, { useState, useEffect, useRef } from "react"

interface Props {
    content: string[]
    delay: string
    cursor: string
    wait: string
}

const TypeWriter: React.FC<Props> = ({content, delay, cursor, wait}) => {

    const [currentText, setCurrentText] = useState<string>("")
    const index = useRef<number>(-1)
    const content_index  = useRef<number>(0)

    useEffect(() => {
        setTimeout(() => {
            index.current = index.current + 1
            setCurrentText((value) => value + content[content_index.current].charAt(index.current))
            if(index.current >= content[content_index.current].length) {
                setTimeout(() => {
                    index.current = -1
                    content_index.current = content_index.current + 1
                    if(content_index.current >= content.length) {
                        content_index.current = 0
                    }
                    setCurrentText("")
                }, parseInt(wait)) 
            }
        }, parseInt(delay))
        // eslint-disable-next-line
    }, [currentText])

    return (
        <div className="typing-container">
            {currentText}{cursor}
        </div>
    )
}

export default TypeWriter