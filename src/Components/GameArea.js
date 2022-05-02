import React, { useRef } from 'react';
import './GameArea.css'
import { v4 as uuidv4 } from 'uuid';

const GameArea = (props) => {

    let checkObjects = []
    const focusNext = useRef([])
    const next = useRef('')
    const words_to_check = props.word_to_check

    //Check the correctness of entry
    const checkEntry = (enteredKey,answerKey) => {
        if(enteredKey.keyCode >= 65 && enteredKey.keyCode <=90 || enteredKey.keyCode === 32) {
            if(enteredKey.key.toUpperCase() === answerKey.toUpperCase()) {
                enteredKey.target.style.backgroundColor = "#4caf50"
                enteredKey.target.style.color = "white"
                if(checkObjects.indexOf(enteredKey.target) === -1) {
                    checkObjects.push(enteredKey.target)
                }
             } else {
                if(checkObjects.indexOf(enteredKey.target) !== -1) {
                    checkObjects.splice(checkObjects.indexOf(enteredKey.target)-1,1)
                }
                enteredKey.target.style.backgroundColor = "#e1e1e1"
            }
            if(focusNext.current.indexOf(enteredKey.target) < focusNext.current.length-1) {
                focusNext.current[focusNext.current.indexOf(enteredKey.target) + 1].focus()
            }
            if(checkObjects.length === props.word_length){
                next.current.style.display = 'block'
            }
        }
    }

    //Get the new sentence from Fetch Component
    const ask_newSentence = () => {
        next.current.style.display = 'none'
        props.next_button(true)
    }

    return (
        <div id="main"  className='game_area'>
                {words_to_check.map((arrayItem,index)=>{
                    return (<div key={index} className='game_rows'>
                    {arrayItem.map( function(each,idx) {
                            if(each === " ") {
                                return (<input key={uuidv4()} className='space' maxLength={1}
                                onKeyUp={(event)=> checkEntry(event,each)} ref={(el) => focusNext.current.push(el)}></input>)
                            } else {
                                if(idx === 0 && index === 0) {
                                    return (<input key={uuidv4()} className='alpha' maxLength={1}
                                    onKeyUp={(event)=>checkEntry(event,each)} ref={(el) => focusNext.current.push(el)} type='text' autoFocus></input>)
                                }
                                return (<input key={uuidv4()} className='alpha' maxLength={1}
                                onKeyUp={(event)=> checkEntry(event,each)} ref={(el) => focusNext.current.push(el)} type='text'></input>)
                            }
                        })}
                    </div>)
                })}
            <button ref={next} className="next_button" onClick={(event) => ask_newSentence(event)}>Next</button>
        </div>
    )
}

export default GameArea;