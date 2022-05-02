import React, {useEffect, useRef, useState} from 'react';
import GameArea from './GameArea';

const FetchContent = () => {

    const [the_Word,set_the_Word] = useState('')
    const axios = require('axios')
    const [score,setScore] = useState(0)
    const [data_to_send,set_data_to_send] = useState([])
    const sentence_Number = useRef(0)
    const gameRef = useRef()
    const winRef = useRef()


    //SCrambling Function
    const getScrambledWord = (string) => {
        let the_scrambled_word = ''
        const words_to_scramble = string.split(" ")
        words_to_scramble.forEach(element => {
            if(element.length >= 5) {
                const scrambling = element.split("")

                let scrambling_index = [scrambling[0]]
                scrambling.splice(0,1)
                const last_element = scrambling[scrambling.length-1]
                scrambling.splice(scrambling.length-1,1)

                while(scrambling.length > 0) { 
                    const number = Math.floor(Math.random() * scrambling.length)
                    scrambling_index.push(scrambling[number])
                    scrambling.splice(number,1)
                }

                scrambling_index.push( last_element)
                the_scrambled_word += scrambling_index.join('')

            } else if (element.length === 4) {

                const mix_up = element.split("")
                let mixed_up_word = mix_up[0]
                mixed_up_word += mix_up[2]
                mixed_up_word += mix_up[1]
                mixed_up_word += mix_up[3]
                the_scrambled_word += mixed_up_word

            } else {
                the_scrambled_word += element
            }
            if(words_to_scramble.indexOf(element) !== words_to_scramble.length-1) {
                the_scrambled_word += " "
            } else {
                set_the_Word(the_scrambled_word)
            }
        })

        const words_to_check = string.split(" ")
        let wordsTemp = [];
        words_to_check.forEach((element, index) => {
            const temp = element.split("");
            if(index < words_to_check.length - 1) {
                temp.push(" ");
            }
            // wordsTemp = wordsTemp.concat(temp);
            wordsTemp.push(temp)
        });
        // console.log("Data to send",wordsTemp);
        set_data_to_send(wordsTemp);
    }

    //Get Data from API
    const getData = async (count) => {
        try {
          const resp = await axios.get("/words.json")
          getScrambledWord(resp.data.words[count])

        } catch (error) {
          console.error(error);
        }
    }

    //Get Data from Next Api
    const getNextAPI = () => {
        if(sentence_Number.current <= 9) {
            sentence_Number.current = sentence_Number.current + 1
            setScore(score+1)
            getData(sentence_Number.current)
        } else {
            gameRef.current.style.display = 'none'
            winRef.current.style.display = 'block'
        }
    }

    //Load first Data
    useEffect( () => {
        getData(sentence_Number.current)
    },[])

    return (
        <section>
            <div className={'game_area'} ref={gameRef}>
                <h1 id="scrambled-word">{the_Word}</h1>
                <p>Guess the sentence! Starting typing</p>
                <p>The yellow blocks are meant for spaces</p>
                <h2>Score {score}</h2>
                <GameArea word_length={the_Word.length} word_to_check={data_to_send} next_button={getNextAPI}/>
            </div>
            <div className='game_win' ref={winRef}>
                <div>You win!</div>
            </div>
        </section>
    )
}

export default FetchContent;