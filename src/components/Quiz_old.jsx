import { useState, useEffect}  from 'react';
import * as wanakana from 'wanakana';
import Papa from 'papaparse';
import JishoAPI from 'unofficial-jisho-api';
const jisho = new JishoAPI();

const Quiz = ({ setReady, decks }) => { 
    console.log(decks);


    const svgPath = "M20 8.163A2.106 2.106 0 0 0 18.926 10c0 .789.433 1.476 1.074 1.837l-.717 2.406a2.105 2.105 0 0 0-2.218 3.058l-2.062 1.602A2.104 2.104 0 0 0 11.633 20l-3.29-.008a2.104 2.104 0 0 0-3.362-1.094l-2.06-1.615A2.105 2.105 0 0 0 .715 14.24L0 11.825A2.106 2.106 0 0 0 1.051 10C1.051 9.22.63 8.54 0 8.175L.715 5.76a2.105 2.105 0 0 0 2.207-3.043L4.98 1.102A2.104 2.104 0 0 0 8.342.008L11.634 0a2.104 2.104 0 0 0 3.37 1.097l2.06 1.603a2.105 2.105 0 0 0 2.218 3.058L20 8.162zM14.823 3.68c0-.063.002-.125.005-.188l-.08-.062a4.103 4.103 0 0 1-4.308-1.428l-.904.002a4.1 4.1 0 0 1-4.29 1.43l-.095.076A4.108 4.108 0 0 1 2.279 7.6a4.1 4.1 0 0 1 .772 2.399c0 .882-.28 1.715-.772 2.4a4.108 4.108 0 0 1 2.872 4.09l.096.075a4.104 4.104 0 0 1 4.289 1.43l.904.002a4.1 4.1 0 0 1 4.307-1.428l.08-.062A4.108 4.108 0 0 1 17.7 12.4a4.102 4.102 0 0 1-.773-2.4c0-.882.281-1.716.773-2.4a4.108 4.108 0 0 1-2.876-3.919zM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z";

    const [terms, setTerms] = useState([]);
    const [terms2, setTerms2] = useState([]);
    const [currentTerm, setCurrentTerm] = useState('');
    const [currentReadings, setCurrentReadings] = useState(['reading']);
    // const [correctness, setCorrectness] = useState(false);
    const [score, setScore] = useState(1);
    const [col, setCol] = useState("rgb(0, 158, 21)");
    const [showFurigana, setShowFurigana] = useState(0);
    const [done, setDone] = useState(false);

    const [betterTerms, setBetterTerms] = useState([]);
 
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const local = true;
    const testDeck = '/n5.json';

    useEffect(() => {
        fetchTerms(decks);
    }, [decks]);

    async function fetchTerms2(decks) {
        for (let i=0; i<decks.length; i++) {
            Papa.parse('/' + decks[i], {
                download: true,
                header: true,
                complete: (results) => {
                    setTerms2(results.data);
                },
                error: (error) => {
                    console.error('Error fetching or parsing CSV file:', error);
                }
            });
        }
    }


    useEffect(() => {
        fetchTerms2(decks);
    }, [decks]);

    useEffect(() => {
        // Ensure that terms2 is populated before accessing it
        if (terms2.length > 45) {
            console.log('Meaning of the 46th term:', terms2[45].meaning);
        } else {
            console.log('Not enough data in terms2');
        }
    }, [terms2]);
    

    async function fetchTerms(decks) {
        try {
            if (decks) {
                const wordList = []
                for (let i=0; i<decks.length; i++) {
                    const path = '/' + decks[i]; //by default looks at public folder
                    const response = await fetch(path);
                    const data = await response.json();
                    const newWords = Object.keys(data);
                    wordList.push(...newWords);                
                }
                setTerms(wordList);
            }

        } catch (error) {
            console.error("error", error);
        }
    }

    useEffect(() => {
        // Fetch and parse the CSV file
        Papa.parse('/kanken.csv', {
            download: true,
            header: true,
            complete: (results) => {
                // Store the data in state
                setBetterTerms(results.data);
            },
            error: (error) => {
                console.error('Error fetching or parsing CSV file:', error);
            }
        });
    }, []);

    useEffect(() => {
        if (betterTerms.length >= 3) {
            const thirdTermMeaning = betterTerms[2].meaning;
            console.log('Meaning of the 3rd term:', thirdTermMeaning);
        }
    }, [betterTerms]);


    async function fetchReadings(term) {
        try {
            if (term) {
                const readings = [];
                if (!local) {
                    const url = proxy + jisho.getUriForPhraseSearch(term);
    
                    const response = await fetch(url);
                    const json = await response.json();
        
                    json.data.forEach(item => {
                        item.japanese.forEach(japanese => {
                            if (japanese.word === term) {
                                readings.push(japanese.reading);
                            }
                        });
                    });

                } else {
                    const path = testDeck;
                    const response = await fetch(path);
                    const data = await response.json();
                    const value = data[term];
                    readings.push(value);
                }

                return readings;
            }


        } catch (error) {
            console.log('error fetching readings: ', error)  
        }
    }

    async function ready() {
        if (terms.length) {
            setShowFurigana(0);
            const term = terms[Math.floor(Math.random() * terms.length)];
            setCurrentTerm(term);
            const readings = await fetchReadings(term);
            setCurrentReadings(readings);
        }
    }   

    useEffect(() => {
        ready();
    }, [terms]);

    async function checkAnswer(e) {
        if (e.key === "Enter") {
            const readings = currentReadings;
            const input = wanakana.toKana(e.target.value);     

            if (!done) {
                if (input) {
                    if (readings.includes(input)) {
                        console.log("correct");
                        setCol("rgb(0, 158, 21)");
                        setShowFurigana(1);
                        setScore(score+1);
                    } else {
                        console.log("incorrect");
                        setCol("rgb(158, 0, 0)");
                        setShowFurigana(1);
                    }
                    setDone(true);
                }

            } else {
                ready();
                setDone(false);
            }

            e.target.value = "";
            console.log("score: " + score);
            console.log("current readings: " + currentReadings);
                
        }
        
    }

    function handleMenuButton() {
        setReady(false);
    }

    return (
    <div className='quiz'>
        <div className="menu-button-container">
            <button id="menu-button" onClick={handleMenuButton}>
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor">
                    <path d={svgPath}></path>
                </svg> */}
                menu
            </button>
        </div>

        <div className="furigana" style={{color: col, opacity:showFurigana}} id="reading">{currentReadings.join(', ')}</div>

        <div className="word-display" id="word">{currentTerm}</div>

        <input className="word-input" autoComplete="off" onKeyDown={e => checkAnswer(e, word)}></input>

        {/* <div class="word-input"> */}
            {/* <input oninput="convertKana()" onkeypress="checkAnswer(event)" type="text" class="input" name="q" size="50" value="" autocomplete="off" id="input" autofocus maxlength="20" placeholder="type the reading"> */}
        {/* </div> */}

    </div>
    )
}

export default Quiz;