import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Category = 'Length' | 'Mass' | 'Temperature';
type Unit = { label: string; value: string };
const categories: Record<Category, Unit[]> = {
	Length: [
		{ label: 'Meters', value: 'm' },
		{ label: 'Kilometers', value: 'km' },
		{ label: 'Centimeters', value: 'cm' },
		{ label: 'Millimeters', value: 'mm' },
		{ label: 'Miles', value: 'mi' },
		{ label: 'Yards', value: 'yd' },
		{ label: 'Feet', value: 'ft' },
		{ label: 'Inches', value: 'in' },
	],
	Mass: [
		{ label: 'Kilograms', value: 'kg' },
		{ label: 'Grams', value: 'g' },
		{ label: 'Milligrams', value: 'mg' },
		{ label: 'Pounds', value: 'lb' },
		{ label: 'Ounces', value: 'oz' },
	],
	Temperature: [
		{ label: 'Celsius', value: 'C' },
		{ label: 'Fahrenheit', value: 'F' },
		{ label: 'Kelvin', value: 'K' },
	],
};

function convert(value: string, from: string, to: string, category: Category): string {
	const num = parseFloat(value);
	if (isNaN(num)) return '';
	if (category === 'Length') {
		const toMeters: Record<string, number> = {
			m: 1,
			km: 1000,
			cm: 0.01,
			mm: 0.001,
			mi: 1609.34,
			yd: 0.9144,
			ft: 0.3048,
			in: 0.0254,
		};
		const meters = num * toMeters[from];
		return (meters / toMeters[to]).toFixed(6);
	}
	if (category === 'Mass') {
		const toKg: Record<string, number> = {
			kg: 1,
			g: 0.001,
			mg: 0.000001,
			lb: 0.453592,
			oz: 0.0283495,
		};
		const kg = num * toKg[from];
		return (kg / toKg[to]).toFixed(6);
	}
	if (category === 'Temperature') {
		if (from === to) return num.toString();
		let celsius = 0;
		if (from === 'C') celsius = num;
		else if (from === 'F') celsius = (num - 32) * 5/9;
		else if (from === 'K') celsius = num - 273.15;
		let result = 0;
		if (to === 'C') result = celsius;
		else if (to === 'F') result = celsius * 9/5 + 32;
		else if (to === 'K') result = celsius + 273.15;
		return result.toFixed(2);
	}
	return '';
}

export default function Metric() {
	const [category, setCategory] = useState<Category>('Length');
	const [fromUnit, setFromUnit] = useState<string>(categories['Length'][0].value);
	const [toUnit, setToUnit] = useState<string>(categories['Length'][1].value);
	const [fromValue, setFromValue] = useState<string>('');
	const [toValue, setToValue] = useState<string>('');

	const handleCategoryChange = (cat: Category) => {
		setCategory(cat);
		setFromUnit(categories[cat][0].value);
		setToUnit(categories[cat][1].value);
		setFromValue('');
		setToValue('');
	};

		const handleFromValueChange = (val: string) => {
			setFromValue(val);
		};

		const handleConvert = () => {
			const res = convert(fromValue, fromUnit, toUnit, category);
			setToValue(res);
		};

	const handleToValueChange = (val: string) => {
		setToValue(val);
	};

				return (
					<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
						<Text style={styles.header}>Metric Converter</Text>
						<View style={styles.dropdownRow}>
							<Menu>
								<MenuTrigger customStyles={{ triggerWrapper: { alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: '#222', borderRadius: 8 } }}>
									<Text style={{ color: '#fff', fontSize: 18 }}>{category}</Text>
								</MenuTrigger>
								<MenuOptions customStyles={{ optionsContainer: { backgroundColor: '#222', borderRadius: 8 } }}>
									{(Object.keys(categories) as Category[]).map((cat) => (
										<MenuOption key={cat} onSelect={() => handleCategoryChange(cat)}>
											<Text style={{ color: '#fff', fontSize: 16, padding: 8 }}>{cat}</Text>
										</MenuOption>
									))}
								</MenuOptions>
							</Menu>
						</View>
					<View style={styles.inputRow}>
						<View style={styles.inputCol}>
							<Picker
								selectedValue={fromUnit}
								style={styles.unitPicker}
								onValueChange={setFromUnit}
							>
								{categories[category].map((unit: Unit) => (
									<Picker.Item key={unit.value} label={unit.label} value={unit.value} />
								))}
							</Picker>
							<TextInput
								style={styles.input}
								value={fromValue}
								onChangeText={handleFromValueChange}
								keyboardType="numeric"
								placeholder="From value"
								placeholderTextColor="#777"
								returnKeyType="done"
							/>
						</View>
						<Text style={styles.equals}>=</Text>
						<View style={styles.inputCol}>
							<Picker
								selectedValue={toUnit}
								style={styles.unitPicker}
								onValueChange={setToUnit}
							>
								{categories[category].map((unit: Unit) => (
									<Picker.Item key={unit.value} label={unit.label} value={unit.value} />
								))}
							</Picker>
							<TextInput
								style={[styles.input, { backgroundColor: '#222', color: '#0f0' }]}
								value={toValue}
								onChangeText={handleToValueChange}
								editable={false}
								placeholder="To value"
								placeholderTextColor="#777"
								returnKeyType="done"
							/>
						</View>
					</View>
							<View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
								<View style={{ width: '60%' }}>
									<Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>Result:</Text>
									<Text style={{ color: '#0f0', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{toValue}</Text>
									<TouchableOpacity style={{ backgroundColor: '#007aff', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }} onPress={handleConvert}>
										<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Convert</Text>
									</TouchableOpacity>
								</View>
							</View>
				</ScrollView>
			);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 40,
		paddingHorizontal: 20,
	},
		header: {
			color: '#fff',
			fontSize: 26,
			fontWeight: '700',
			marginBottom: 20,
		},
			dropdownRow: {
				width: '100%',
				marginBottom: 24,
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'row',
			},
			dropdown: {
				width: 120,
				color: '#fff',
				backgroundColor: 'transparent',
				borderRadius: 0,
				marginBottom: 0,
				marginTop: 0,
				alignSelf: 'center',
			},
		inputRow: {
			flexDirection: 'row',
			alignItems: 'center',
			width: '100%',
			marginBottom: 16,
			justifyContent: 'center',
		},
		inputCol: {
			flex: 1,
			alignItems: 'center',
		},
			unitPicker: {
				width: 120,
				color: '#fff',
				backgroundColor: 'transparent',
				borderRadius: 0,
				marginBottom: 0,
				marginTop: 0,
				alignSelf: 'center',
			},
		input: {
			width: '90%',
			backgroundColor: '#222',
			color: '#fff',
			borderRadius: 8,
			padding: 10,
			fontSize: 18,
			marginBottom: 8,
			textAlign: 'center',
		},
		equals: {
			color: '#fff',
			fontSize: 28,
			fontWeight: 'bold',
			marginHorizontal: 10,
		},
});
