import './index.scss';
import { useEffect, useRef, useState } from 'react';
import Card from "./Card.jsx"


async function generateIcons(array){
    for(let i = 0; i <= 8 - 1; i++){   
        try{
            const response = await fetch("https://api.thecatapi.com/v1/images/search");
            
            if(!response.ok){
                throw new Error("Could not fetch");
            }

            const data = await response.json();
            array.push(data[0].url)
            array.push(data[0].url)
            
        }catch(error){
            console.log(error)
        }
    }
    
    return array;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateCards(icons){
    let newCard = []
    let index = 0;
    for(let j = 0; j <= (icons.length) - 1; j++){
        newCard = [...newCard, {id: index, image: icons[j], status: ''}];
        if(j % 2 === 1){
            index += 1;
        }
    }   
    shuffleArray(newCard);
    return [...newCard];
}

let icons = await generateIcons([]);

function CardGrid(){
    const [cards, setCards] = useState([]);
    const [prevCard, setPreCard] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);

    const prevIndex = useRef(undefined);


    useEffect(() => {
        setCards(generateCards(icons));
    }, [])


    function testMatch(targetIndex){
        if(cards[targetIndex].id == cards[prevCard].id){
            cards[targetIndex].status = 'active match';
            cards[prevCard].status = 'active match';
            setPreCard(undefined);
            setCards([...cards]);
            setScore(prevScore => prevScore + 2);
            
        }else{
            cards[targetIndex].status = 'active';
            setCards([...cards]);
            
            if(score > 0){
                setScore(prevScore => prevScore - 1);
            }

            setTimeout(() => {
                cards[targetIndex].status = '';
                cards[prevCard].status = '';
                setCards([...cards]);
                setPreCard(undefined);
            }, 500);
        }
        
    }


    function handleCardClick(index){
        if(prevIndex.current === index || cards[index].status == 'active match'){
            return
        }
        if(prevCard === undefined){
            prevIndex.current = index;
            cards[index].status = 'active';
            setCards([...cards]);
            setPreCard(index);
        }else{
            testMatch(index);
            prevIndex.current = undefined;
        }
    }

    return(
        <>
            {isLoading === true? <div className='loadingScreen'><h1>Loading</h1></div> : null}

            <div className='cardHeader'>
                <button onClick={() => location.reload()}>Reset</button>
                <h1>Memory Game</h1>
                <p>Score: {score}</p>
            </div>

            <div className="cardGrid">
                {cards.map((card, index) => {
                    setTimeout(() => {setIsLoading(false)}, 2000);
                    return <Card key={index} image={card.image} status={card.status} index={index} clickFunction={handleCardClick}/>
                })}
            </div>
        </>
    );
}

export default CardGrid;