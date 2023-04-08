import { useEffect, useState } from 'react'
import cardBackImage from "../../assets/card-back.png"
import congratsImg from "../../assets/congrats.png"
import puzzleImg from "../../assets/puzzle.svg"
import cards from '../../data/card'
import './style.css'

function App() {

  let [cardList, setCards] = useState(cards)
  let [sameTag, setSameTag] = useState({
    tag: '',
    id: '',
  })
  let [clickedCardCount, setClickedCardCount] = useState(0)
  let [congrats, setCongrats] = useState(false)
  let [punctuation, setPunctuation] = useState(0)

  useEffect(() => {
    checkIfAllCardsAreCoincide(cardList)
  }, [cardList])

  const handleShuffleCardsOnLoad = (array) => {
    let localCards = [...array]
    let localPunctuation = punctuation

    localPunctuation = 0
    changeAllCardsCoincideToFalse(localCards)
    localCards.sort(() => Math.random() - 0.5)
    checkIfAllCardsAreCoincide(localCards)
    setPunctuation(localPunctuation)
    flipeAllCardsFront([...localCards])
    setCards([...localCards])
    setTimeout(() => {
      flipeAllCardsBack(localCards)
      setCards([...localCards])
    }, 1500)
  };

  const handleShuffleCardsOnClick = (array) => {
    setTimeout(() => {
      let localCards = [...array]
      let localPunctuation = punctuation

      localPunctuation = 0
      changeAllCardsCoincideToFalse(localCards)
      checkIfAllCardsAreCoincide(localCards)
      localCards.sort(() => Math.random() - 0.5)
      setCards(localCards)
      flipeAllCardsFront(localCards)
      setCards(localCards)
      setPunctuation(localPunctuation)

      setTimeout(() => {
        flipeAllCardsBack(localCards)
        setCards([...localCards])
      }, 1500)
    }, 1000)
  };

  const handleFlipCard = (cardGame) => {
    let localCards = [...cardList]
    let localSameTag = { ...sameTag }
    let localClickedCardCount = clickedCardCount
    localClickedCardCount++
    let localPunctuation = punctuation

    if (localClickedCardCount > 2) {
      return
    }

    if (localClickedCardCount === 1) {
      flipeFirstCard(localCards, cardGame)
      localSameTag.tag = cardGame.tag
      localSameTag.id = cardGame.id

    } else if (localClickedCardCount === 2) {
      flipeSecondCard(localCards, cardGame)

      if (localSameTag.tag === cardGame.tag) {
        removeCards(localCards, cardGame)
        localPunctuation += 10
      } else {
        localPunctuation -= 5
      }
    }
    setPunctuation(localPunctuation)
    setCards(localCards)
    setSameTag(localSameTag)
    setClickedCardCount(localClickedCardCount)
  }

  const checkIfAllCardsAreCoincide = (array) => {
    if (array.every((card) => card.coincide === true)) {
      let localCongrats = congrats
      localCongrats = true
      setCongrats(localCongrats)
    }
  }

  const changeAllCardsCoincideToFalse = (array) => {
    array.forEach((card) => card.coincide = false);
    setCongrats(false)
  }

  const flipeAllCardsBack = (array) => {
    array.forEach((card) => card.turned = false);
  }

  const flipeAllCardsFront = (array) => {
    array.forEach((card) => card.turned = true);
  }

  const flipeFirstCard = (array, cardGame) => {
    const findCard = array.find((card) => card.id === cardGame.id);
    findCard.turned = !findCard.turned;
    setCards([...array])
  }

  const flipeSecondCard = (array, cardGame) => {
    const findCardTwo = array.find((card) => card.id === cardGame.id);
    const findCardOne = array.find((card) => card.id === sameTag.id);

    findCardTwo.turned = !findCardTwo.turned;
    setCards([...array])

    setTimeout(() => {

      findCardOne.turned = !findCardOne.turned;
      findCardTwo.turned = !findCardTwo.turned;
      setCards([...array])

      let localClickedCardCount = clickedCardCount
      localClickedCardCount = 0
      setClickedCardCount(localClickedCardCount)
    }, 1000)
  }

  const removeCards = (array, cardGame) => {
    const findCardOne = array.find((card) => card.id === cardGame.id);
    const findCardTwo = array.find((card) => card.id === sameTag.id);

    setTimeout(() => {
      findCardOne.coincide = !findCardOne.coincide;
      findCardTwo.coincide = !findCardTwo.coincide;
      setCards([...array])
    }, 1000)
  }

  return (
    <div className="App"
      onLoad={() => handleShuffleCardsOnLoad(cardList)}
    >
      <div className='sidebar'>
        <div className='logo-side'>
          <img src={puzzleImg} alt="" />
          <h1>Puzzle</h1>
        </div>
        <div className='punctuation-box'>
          <h1 className='punctuation'>{punctuation}</h1>
          <span className='punctuation-text'>{punctuation === 1 ? 'Ponto' : 'Pontos'}</span>
        </div>
        <button
          className='reset-btn'
          onClick={() => handleShuffleCardsOnClick(cards)}
        >Reset</button>
      </div>
      <div className='container'>
        <div className='congrats' style={{
          backgroundImage: `url(${congratsImg})`,
          visibility: congrats ? `visible` : `hidden`
        }}
        ></div>
        <div className={`flex-div`}>
          {cardList.map((card) => (
            <div
              key={card.id}
              className={`card ${card.tag}`}
              style={{
                backgroundImage: card.turned ? `url(${card.image})` : `url(${cardBackImage})`,
                visibility: card.coincide ? `hidden` : `visible`,
              }}
              onClick={() => handleFlipCard(card)}>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;