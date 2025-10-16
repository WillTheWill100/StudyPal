import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [input, setInput] = useState('');
  const [scientific, setScientific] = useState(false);

  const handlePress = (value: string) => {
    if (value === 'C') {
      setInput('');
    } else if (value === '⌫') {
      setInput((prev) => prev.slice(0, -1));
    } else if (value === '=') {
      try {
        let sanitizedInput = input
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/\^/g, '**');
        sanitizedInput = sanitizedInput
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/√\(/g, 'Math.sqrt(');

        let result = eval(sanitizedInput);
        if (typeof result === 'number' && !Number.isInteger(result)) {
          result = parseFloat(result.toFixed(8));
        }
        setInput(result.toString());
      } catch (error) {
        setInput('Error');
      }
    } else if (value === 'SCI') {
      setScientific((prev) => !prev);
    } else {
      setInput(input + value);
    }
  };

  const basicButtons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', 'C', '+'],
    ['SCI', '=', '⌫'],
  ];

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'log'],
    ['(', ')', '^', '√'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', 'C', '+'],
    ['SCI', '=', '⌫'],
  ];

  const buttons = scientific ? scientificButtons : basicButtons;

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{input || '0'}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => {
              const sciFunctions = ['sin', 'cos', 'tan', 'log', '^', '√'];
              const operationButtons = ['+', '-', '×', '÷'];
              const isSciFunc = scientific && sciFunctions.includes(button);
              const isOperation = operationButtons.includes(button);
              return (
                <TouchableOpacity
                  key={button}
                  style={[ 
                    styles.button,
                    (scientific && sciFunctions.includes(button)) ? styles.sciButton : null,
                    button === 'SCI' ? styles.sciButton : null,
                    isOperation ? styles.orangeButton : null,
                    button === 'C' || button === '⌫' ? styles.redButton : null,
                    button === '=' ? styles.greenButton : null
                  ]}
                  onPress={() => handlePress(button)}
                >
                  <Text style={[ 
                    styles.buttonText,
                    (scientific && sciFunctions.includes(button)) ? styles.sciButtonText : null,
                    button === 'SCI' ? styles.sciButtonText : null,
                    isOperation ? styles.orangeButtonText : null,
                    button === 'C' || button === '⌫' ? styles.redButtonText : null,
                    button === '=' ? styles.greenButtonText : null
                  ]}>{button}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
    padding: 10,
  },
  display: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  displayText: {
    color: '#fff',
    fontSize: 48,
    textAlign: 'right',
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 5,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 28,
  },
  sciButton: {
    backgroundColor: '#007aff',
  },
  sciButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  redButton: {
    backgroundColor: '#ff3b30',
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  greenButton: {
    backgroundColor: '#34c759',
  },
  greenButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orangeButton: {
    backgroundColor: '#ff9500',
  },
  orangeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
