import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions, Modal } from 'react-native';
//import { WebView } from 'react-native-webview';  StatusBar
//<StatusBar hidden /><WebView source={{ uri: 'https://www.cs.uoi.gr/~cse42680/app/index.html' }}/>
import ModalComponent from './ModalComponent';



const App = () => {

  const emo = ['😀', '😊', '🥳', '😎', '🤩'];

  const emoticons = [require('./output/image_0.png'), require('./output/image_1.png'), require('./output/image_2.png'), require('./output/image_3.png'),
  require('./output/image_4.png'), require('./output/image_5.png'), require('./output/image_6.png'),
  require('./output/image_7.png'), require('./output/image_8.png'), require('./output/image_9.png')];
  const [showAll, setShowAll] = useState(false);
  const [gridItems, setGridItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const timeoutRef = useRef(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [gridClickable, setGridClickable] = useState(true);


  const initializeGrid = (showModal = false) => {
    setShowAll(false);
    const newGridItems = [];
    const firstArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const secondArray = [];


    for (let i = 0; i < firstArray.length; i++) {
      const value = firstArray[i];

      const randomIndex1 = Math.floor(Math.random() * (secondArray.length + 1));
      const randomIndex2 = Math.floor(Math.random() * (secondArray.length + 1));

      secondArray.splice(randomIndex1, 0, value);
      secondArray.splice(randomIndex2, 0, value);
    }
    const finalGrid = [];
    for (let i = 0; i < secondArray.length; i++) {
      finalGrid.push(emoticons[secondArray[i] - 1]);
    }
    var pos = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        newGridItems.push({
          coordinates: [emo[Math.floor(Math.random() * emo.length)]],
          isVisible: false,
          emoticon: finalGrid[pos],
          isRemoved: false,
          id: [i, j],
        });
        pos++;
      }
    }
    //console.log(finalGrid)
    setMoves(0);
    setGridItems(newGridItems);
    setSelectedItems([]);
  };



  useEffect(() => {
    if (selectedItems.length === 2) {
      clearTimeout(timeoutRef.current);
      const [firstItem, secondItem] = selectedItems;

      if (firstItem.emoticon === secondItem.emoticon && firstItem.id != secondItem.id) {
        setGridItems((prevGridItems) => {
          const updatedGridItems = [...prevGridItems];
          firstItem.isVisible = false;
          firstItem.emoticon = null;
          firstItem.isRemoved = true;
          secondItem.isVisible = false;
          secondItem.emoticon = null;
          secondItem.isRemoved = true;
          //const allItemsRemoved = gridItems.every((item) => item.isRemoved);
          //console.log(allItemsRemoved);
          const removedItemCount = gridItems.filter((item) => item.isRemoved).length;
          if (removedItemCount === 4) {
            // alert("You Won!");
            setIsWon(true);

          }
          return updatedGridItems;
        });


        setSelectedItems([]);
        clearTimeout(timeoutRef.current);
        console.log(gridItems);
        //}, 0);
      } else {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setGridItems((prevGridItems) => {
            const updatedGridItems = [...prevGridItems];
            updatedGridItems.forEach((item) => {
              if (item.isVisible) {

                item.isVisible = false;
              }
            });
            return updatedGridItems;
          });
          setSelectedItems([]);
        }, 1000);
      }

    }

  },

    [selectedItems]);




  const startFunction = () => {
    setGridItems((prevGridItems) => {
      const updatedGridItems = [...prevGridItems];
      updatedGridItems.forEach((item) => {
        item.isVisible = true;
      });

      return updatedGridItems;
    });
    setGridClickable(true);
  };

  const goFunction = () => {
    setGridItems((prevGridItems) => {
      const updatedGridItems = [...prevGridItems];
      updatedGridItems.forEach((item) => {
        item.isVisible = false;
      });
      setShowAll(true);
      return updatedGridItems;
    });
    setGridClickable(false);
  };


  const onGridItemClick = (index) => {
    //setTimeout(() => {
    if (!gridClickable) {
      if (selectedItems.length < 2) {
        const clickedItem = gridItems[index];

        const isItemSelected = selectedItems.some((item) => item.id === clickedItem.id);
        if (isItemSelected) {
          return;
        }
        setGridItems((prevGridItems) => {

          const updatedGridItems = [...prevGridItems];
          updatedGridItems[index].isVisible = true;

          const selectedItem = updatedGridItems[index];
          setSelectedItems((prevSelectedItems) => [...prevSelectedItems, selectedItem]);

          return updatedGridItems;
        });

        if (selectedItems.length === 0) {
          setMoves((prevMoves) => prevMoves + 1);
        }
      }
    }
    //}, 0);
  };

  return (

    <View style={styles.appView}>
      <View style={styles.buttonsPlex}>
        <TouchableOpacity onPress={initializeGrid} style={[styles.button, styles.buttonMargin]}>
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>

        {!showAll && (
          <TouchableOpacity onPress={startFunction} style={[styles.button, styles.buttonMargin]}>
            <Text style={styles.buttonStart}>Start</Text>
          </TouchableOpacity>
        )}

        {!showAll && (
          <TouchableOpacity onPress={goFunction} style={[styles.button, styles.buttonMargin]}>
            <Text style={styles.buttonGo}>Go</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>


        <Text style={styles.movesText}>Moves: {moves}</Text>
        <View style={styles.gridBoarderus}>

          <View style={styles.gridContainer}>

            {gridItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onGridItemClick(index)}
                style={[
                  styles.gridItem,
                  {
                    backgroundColor: item.isRemoved ? 'transparent' : '#fdeedeff',
                  },
                ]}
                disabled={item.emoticon === null}
              >
                {item.isVisible && (
                  <Image source={item.emoticon} style={styles.initImage} />
                )}

                {item.isRemoved && (
                  <Text style={{ color: 'white' }}>
                    {item.coordinates.join(' , ')}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </View >
      <ModalComponent isWon={isWon} setIsWon={setIsWon} />

    </View>

  );
};

const { width, height } = Dimensions.get('window');

//git 1 xB = min(xA, yA) * r      xB = min(xA, 0.7 * yA) * r
//      yB = min(xA, yA)          yB = min(min(xA, 0.7 * yA), yA)

const gridWidth = Math.floor(Math.min(width, height) * 0.7);
const gridHeight = Math.floor(Math.min(Math.min(width, 0.8 * height), height)); //Math.floor(height * 0.8);

const gridItemWidth = Math.floor(gridWidth * (1 / 5));
const gridItemHeight = Math.floor(gridWidth * (1 / 5));

const gridPadding = Math.min(gridWidth, gridHeight) * 0.01;
const gridItemMargin = Math.floor(Math.min(gridWidth, gridHeight) * 0.02);

const itemsPerRow = 4;
const gridRepeatWidth = Math.floor(gridItemWidth * 1.2);
const gridRepeatHeight = Math.floor(gridHeight * 0.2);

const buttonWidth = (Math.floor(Math.min(width, height)) / gridWidth) * gridItemWidth * 1.4;//220 * (gridWidth / width); //parseInt(gridWidth * 0.45);
const buttonHeight = (Math.floor(Math.min(width, height)) * 1.2 / gridHeight) * gridHeight * 0.05;//70 * (gridHeight / height);

const styles = StyleSheet.create({

  appView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdeedeff',
    marginBottom: 0
  },

  buttonsPlex: {

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: height * 0.09, //100-180
    bottom: -10,
  },
  buttonMargin: {
    marginRight: 15,
  },
  container: {

    flex: 1,
    justifyContent: 'flex-start', // godlike line
    alignItems: 'center',
    backgroundColor: '#fdeedeff',

  },
  movesText: {

    fontSize: 20,
    fontWeight: 'bold',
    color: '#4472c4ff',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  initImage: {
    //flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  button: {
    width: buttonWidth,
    height: buttonHeight,
    backgroundColor: '#ffb703',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    marginTop: -50,
  },
  buttonText: {
    color: '#4472c4ff',
    fontSize: 20,
    fontWeight: 'bold',

  },
  buttonGo: {
    color: '#4472c4ff',
    fontSize: 20,
    fontWeight: 'bold',


  },
  buttonStart: {
    color: '#4472c4ff',
    fontSize: 20,
    fontWeight: 'bold',

  },

  gridBoarderus: {
    marginBottom: 100,
    marginTop: 20,
    //display: 'box',
    border: '1px solid black',

  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: `repeat(${itemsPerRow}, ${gridRepeatWidth}px)`,//'repeat(4, minmax(100px, 1fr))',
    gridTemplateRows: `repeat(${itemsPerRow}, ${gridRepeatHeight}px)`,//'repeat(4, minmax(100px, 1fr))',
    //borderWidth: 15,

    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'black',

    backgroundColor: '#4472c4ff',
    color: '#0583a0',
    borderRadius: 3,
    padding: gridPadding,
    width: gridWidth,
    height: gridHeight + 15,
  },

  diagonalLine: {

    position: 'absolute',
    display: 'box',
    bottom: 30,
    left: 220,
    width: '67%',
    height: 200,
    backgroundColor: '#4472c4ff',
    transform: [{ rotateZ: '-2deg' }, { rotateY: '215deg' }, { rotateX: '120deg' }],


  },

  gridItem: {
    width: gridItemWidth,
    height: gridItemHeight,
    justifyContent: 'center',
    alignItems: 'center',
    margin: gridItemMargin,
    borderRadius: 15,

  },
  gridItemText: {
    color: 'white',
    width: 100,
    height: 100,
    borderRadius: 15,
  },

});

export default App;